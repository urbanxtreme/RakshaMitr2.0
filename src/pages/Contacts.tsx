
import { useState, useEffect } from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import ContactCard, { Contact } from "@/components/ContactCard";
import AddContactForm from "@/components/AddContactForm";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const Contacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchContacts();
    }
  }, [user]);

  const fetchContacts = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('emergency_contacts')
        .select('id, name, phone_number')
        .eq('user_id', user?.id);
      
      if (error) throw error;
      
      if (data) {
        const formattedContacts = data.map(contact => ({
          id: contact.id,
          name: contact.name,
          phone: contact.phone_number
        }));
        
        setContacts(formattedContacts);
      } else {
        setContacts([]);
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
      toast({
        variant: "destructive", 
        title: "Failed to load contacts",
        description: "Please try again later."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddContact = async (newContact: Omit<Contact, "id">) => {
    try {
      if (editingContact) {
        // Update existing contact
        const { error } = await supabase
          .from('emergency_contacts')
          .update({
            name: newContact.name,
            phone_number: newContact.phone
          })
          .eq('id', editingContact.id);
        
        if (error) throw error;

        setContacts(contacts.map(contact => 
          contact.id === editingContact.id 
            ? { ...contact, ...newContact } 
            : contact
        ));
        setEditingContact(null);
        toast({
          title: "Contact Updated",
          description: `${newContact.name} has been updated.`,
        });
      } else {
        // Add new contact
        const { data, error } = await supabase
          .from('emergency_contacts')
          .insert({
            user_id: user?.id,
            name: newContact.name,
            phone_number: newContact.phone
          })
          .select();
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          const contact = {
            id: data[0].id,
            name: newContact.name,
            phone: newContact.phone
          };
          setContacts([...contacts, contact]);
          toast({
            title: "Contact Added",
            description: `${newContact.name} has been added to your emergency contacts.`,
          });
        }
      }
    } catch (error) {
      console.error("Error saving contact:", error);
      toast({
        variant: "destructive",
        title: "Failed to save contact",
        description: "Please try again."
      });
    }
    setIsAddDialogOpen(false);
    
    // Fetch contacts again to ensure UI is in sync with database
    fetchContacts();
  };

  const handleEditContact = (contact: Contact) => {
    setEditingContact(contact);
    setIsAddDialogOpen(true);
  };

  const handleDeleteContact = async (id: string) => {
    try {
      const contactToDelete = contacts.find(contact => contact.id === id);
      
      const { error } = await supabase
        .from('emergency_contacts')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setContacts(contacts.filter(contact => contact.id !== id));
      toast({
        title: "Contact Removed",
        description: `${contactToDelete?.name || "Contact"} has been removed.`,
      });
    } catch (error) {
      console.error("Error deleting contact:", error);
      toast({
        variant: "destructive",
        title: "Failed to delete contact",
        description: "Please try again."
      });
    }
  };

  return (
    <div className="min-h-screen pb-20 p-4 bg-gradient-to-b from-white to-raksha-blue/10">
      <div className="max-w-md mx-auto pt-8">
        <div className="mb-6 animate-fade-in">
          <h1 className="text-2xl font-bold">Emergency Contacts</h1>
          <p className="text-muted-foreground mt-1">
            Manage contacts who will receive SOS alerts
          </p>
        </div>
        
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-raksha-purple"></div>
            </div>
          ) : contacts.length === 0 ? (
            <div className="text-center py-12 animate-fade-in">
              <p className="text-muted-foreground">No emergency contacts yet.</p>
              <p className="text-sm mt-1">Add contacts who should be notified during emergencies.</p>
            </div>
          ) : (
            contacts.map(contact => (
              <ContactCard
                key={contact.id}
                contact={contact}
                onDelete={handleDeleteContact}
                onEdit={handleEditContact}
              />
            ))
          )}
        </div>
        
        <Button 
          variant="default" 
          onClick={() => {
            setEditingContact(null);
            setIsAddDialogOpen(true);
          }}
          className="mt-6 w-full bg-raksha-purple hover:bg-raksha-purple-dark animate-fade-in"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Contact
        </Button>
        
        <Dialog 
          open={isAddDialogOpen} 
          onOpenChange={setIsAddDialogOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingContact ? "Edit Contact" : "Add Emergency Contact"}
              </DialogTitle>
              <DialogDescription>
                Contact phone numbers should include country code (e.g., +1 for US)
              </DialogDescription>
            </DialogHeader>
            <AddContactForm
              onAdd={handleAddContact}
              editingContact={editingContact}
              onCancel={() => setIsAddDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Contacts;
