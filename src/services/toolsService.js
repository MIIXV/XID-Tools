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
    async deleteTool(tool) {
        // 1. Try to delete associated files from storage first
        const filesToDelete = [];

        // Helper to extract path from full URL
        const getPathFromUrl = (url) => {
            if (!url) return null;
            try {
                // Assuming URL format: .../storage/v1/object/public/tool-files/filename
                const urlObj = new URL(url);
                const projectUrl = supabase.storageUrl || urlObj.origin; // fallback to origin if storageUrl not set in client

                if (url.includes('/storage/v1/object/public/tool-files/')) {
                    const parts = url.split('/tool-files/');
                    if (parts.length === 2) {
                        return decodeURIComponent(parts[1]);
                    }
                }
                return null;
            } catch (e) {
                console.warn('Invalid URL for file deletion:', url);
                return null;
            }
        };

        if (tool.url) {
            const path = getPathFromUrl(tool.url);
            if (path) filesToDelete.push(path);
        }

        if (tool.image_url) {
            const path = getPathFromUrl(tool.image_url);
            if (path) filesToDelete.push(path);
        }

        if (filesToDelete.length > 0) {
            const { error: storageError } = await supabase.storage
                .from('tool-files')
                .remove(filesToDelete);

            if (storageError) {
                console.error('Error deleting files from storage:', storageError);
                // We continue to delete the DB record even if file deletion fails, 
                // but log the error.
            }
        }

        // 2. Delete database record
        const { error } = await supabase
            .from('tools')
            .delete()
            .eq('id', tool.id);

        if (error) {
            console.error('Error deleting tool:', error);
            throw error;
        }
        return true;
    },

    // Upload a file to storage
    async uploadToolFile(file, title) {
        // Sanitize title for filename: remove slashes, keep Chinese/English/Numbers/Dashes
        const sanitizedTitle = (title || 'untitled').replace(/[\/\\]/g, '_').trim();
        // Use timestamp to ensure uniqueness
        const timestamp = Date.now();
        // Get extension
        const ext = file.name.split('.').pop();

        const fileName = `${sanitizedTitle}_${timestamp}.${ext}`;

        // Force valid content type for HTML files
        let contentType = file.type;
        if (file.name.toLowerCase().endsWith('.html') || file.name.toLowerCase().endsWith('.htm')) {
            contentType = 'text/html';
        }

        const { data, error } = await supabase.storage
            .from('tool-files')
            .upload(fileName, file, {
                contentType: contentType,
                upsert: false
            });

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
