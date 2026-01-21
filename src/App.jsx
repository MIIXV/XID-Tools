import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import ToolGrid from './components/ToolGrid';
import ToolCard from './components/ToolCard';
import AddToolModal from './components/AddToolModal';
import { toolsService } from './services/toolsService';

function App() {
  const [tools, setTools] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTool, setEditingTool] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load tools on mount
  useEffect(() => {
    loadTools();
  }, []);

  const loadTools = async () => {
    setLoading(true);
    const data = await toolsService.fetchTools();
    setTools(data);
    setLoading(false);
  };

  // Filter tools
  const filteredTools = tools.filter(tool => {
    const q = searchQuery.toLowerCase();
    return (
      tool.title.toLowerCase().includes(q) ||
      (tool.description && tool.description.toLowerCase().includes(q)) ||
      (tool.tags && tool.tags.some(tag => tag.toLowerCase().includes(q)))
    );
  });

  const handleOpenTool = (tool) => {
    window.open(tool.url, '_blank');
  };

  const handleEditTool = (tool) => {
    setEditingTool(tool);
    setIsModalOpen(true);
  };

  const handleDeleteTool = async (tool) => {
    const password = prompt(`To delete "${tool.title}", please enter the admin password:`);

    if (password === null) return; // Users cancelled

    if (password !== 'xiddeletecheck') {
      alert('Incorrect password. Deletion cancelled.');
      return;
    }

    try {
      await toolsService.deleteTool(tool);
      setTools(tools.filter(t => t.id !== tool.id));
    } catch (error) {
      alert('Failed to delete tool');
    }
  };

  const handleAddTool = () => {
    setEditingTool(null);
    setIsModalOpen(true);
  };

  const handleSaveTool = async (toolData) => {
    try {
      if (editingTool) {
        // Update
        const updated = await toolsService.updateTool(editingTool.id, toolData);
        setTools(tools.map(t => t.id === editingTool.id ? updated : t));
      } else {
        // Create
        const newTool = await toolsService.addTool(toolData);
        setTools([newTool, ...tools]);
      }
      setIsModalOpen(false); // Close modal on success
    } catch (error) {
      alert('Failed to save tool');
    }
  };

  return (
    <Layout onSearch={setSearchQuery} onAdd={handleAddTool}>
      {loading ? (
        <div style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '4rem' }}>
          Loading tools...
        </div>
      ) : (
        <>
          <ToolGrid>
            {filteredTools.map(tool => (
              <ToolCard
                key={tool.id}
                tool={tool}
                onOpen={handleOpenTool}
                onEdit={handleEditTool}
                onDelete={handleDeleteTool}
              />
            ))}
          </ToolGrid>

          {filteredTools.length === 0 && (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
              <p>No tools found matching "{searchQuery}"</p>
            </div>
          )}
        </>
      )}

      <AddToolModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTool}
        initialData={editingTool}
      />
    </Layout>
  );
}

export default App;
