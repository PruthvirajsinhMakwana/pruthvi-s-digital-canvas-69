import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Mail, MailOpen, Trash2, Download } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface Message {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
}

const AdminMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const markAsRead = async (id: string, isRead: boolean) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ is_read: !isRead })
        .eq('id', id);

      if (error) throw error;
      fetchMessages();
    } catch (error) {
      console.error('Error updating message:', error);
      toast.error('Failed to update message');
    }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Message deleted');
      setSelectedMessage(null);
      fetchMessages();
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error('Failed to delete message');
    }
  };

  const exportCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Message', 'Date', 'Read'];
    const rows = messages.map(m => [
      m.name,
      m.email,
      m.phone || '',
      m.message.replace(/"/g, '""'),
      format(new Date(m.created_at), 'yyyy-MM-dd HH:mm'),
      m.is_read ? 'Yes' : 'No'
    ]);
    
    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `messages-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    
    toast.success('Messages exported');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold">Contact Messages</h2>
          <p className="text-muted-foreground">{messages.length} total messages</p>
        </div>
        {messages.length > 0 && (
          <Button variant="glass" onClick={exportCSV}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        )}
      </div>

      {messages.length > 0 ? (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Messages List */}
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="divide-y divide-border max-h-[600px] overflow-y-auto">
              {messages.map((message) => (
                <button
                  key={message.id}
                  onClick={() => {
                    setSelectedMessage(message);
                    if (!message.is_read) {
                      markAsRead(message.id, false);
                    }
                  }}
                  className={`w-full p-4 text-left hover:bg-muted/50 transition-colors ${
                    selectedMessage?.id === message.id ? 'bg-muted/50' : ''
                  } ${!message.is_read ? 'bg-primary/5' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                      message.is_read ? 'bg-muted-foreground/30' : 'bg-primary'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-medium truncate">{message.name}</span>
                        <span className="text-xs text-muted-foreground flex-shrink-0">
                          {format(new Date(message.created_at), 'MMM d')}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{message.email}</p>
                      <p className="text-sm text-muted-foreground line-clamp-1 mt-1">{message.message}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Message Detail */}
          <div className="glass-card rounded-2xl p-6">
            {selectedMessage ? (
              <div className="space-y-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-heading text-xl font-bold">{selectedMessage.name}</h3>
                    <a 
                      href={`mailto:${selectedMessage.email}`}
                      className="text-primary hover:underline"
                    >
                      {selectedMessage.email}
                    </a>
                    {selectedMessage.phone && (
                      <p className="text-muted-foreground">{selectedMessage.phone}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => markAsRead(selectedMessage.id, selectedMessage.is_read)}
                      title={selectedMessage.is_read ? 'Mark as unread' : 'Mark as read'}
                    >
                      {selectedMessage.is_read ? (
                        <Mail className="w-4 h-4" />
                      ) : (
                        <MailOpen className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteMessage(selectedMessage.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  Received on {format(new Date(selectedMessage.created_at), 'MMMM d, yyyy at h:mm a')}
                </div>

                <div className="p-4 bg-muted/50 rounded-xl">
                  <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>

                <Button variant="hero" asChild>
                  <a href={`mailto:${selectedMessage.email}`}>
                    Reply via Email
                  </a>
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                <Mail className="w-12 h-12 mb-4" />
                <p>Select a message to view</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="glass-card rounded-2xl p-12 text-center">
          <Mail className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-heading text-xl font-bold mb-2">No messages yet</h3>
          <p className="text-muted-foreground">Messages from your contact form will appear here.</p>
        </div>
      )}
    </div>
  );
};

export default AdminMessages;
