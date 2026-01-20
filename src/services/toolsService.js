import { supabase } from '../lib/supabase';

export const toolsService = {
    // Fetch all tools, ordered by creation date (newest first)
    async fetchTools() {
        const { data, error } = await supabase
            .from('tools')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching tools:', error);
            return [];
        }
        return data;
    },

    // Add a new tool
    async addTool(tool) {
        const { data, error } = await supabase
            .from('tools')
            .insert([tool])
            .select()
            .single();

        if (error) {
            console.error('Error adding tool:', error);
            throw error;
        }
        return data;
    },

    // Update an existing tool
    async updateTool(id, updates) {
        const { data, error } = await supabase
            .from('tools')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating tool:', error);
            throw error;
        }
        return data;
    },

    // Delete a tool
    async deleteTool(id) {
        const { error } = await supabase
            .from('tools')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting tool:', error);
            throw error;
        }
        return true;
    },

    // Upload a file to storage
    async uploadToolFile(file) {
        const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        const { data, error } = await supabase.storage
            .from('tool-files')
            .upload(fileName, file);

        if (error) {
            console.error('Error uploading file:', error);
            throw error;
        }

        const { data: { publicUrl } } = supabase.storage
            .from('tool-files')
            .getPublicUrl(fileName);

        return publicUrl;
    }
};
