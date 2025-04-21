
import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ContactCard, { Contact } from "@/components/ContactCard";
import AddContactForm from "@/components/AddContactForm";
import { useToast } from "@/components/ui/use-toast";

// Sample data for demo
const initialContacts: Contact[] = [
  { id: "1", name: "Mom", phone: "+917654321098" },
  { id: "2", name: "Dad", phone: "+917654321099" },
  { id: "3", name: "Sister", phone: "+917654321090" },
];

const Contacts = () => {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const { toast } = useToast();

  const handleAddContact = (newContact: Omit<Contact, "id">) => {
    if (editingContact) {
      // Update existing contact
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
      const contact = {
        id: Date.now().toString(),
        ...newContact,
      };
      setContacts([...contacts, contact]);
      toast({
        title: "Contact Added",
        description: `${newContact.name} has been added to your emergency contacts.`,
      });
    }
    setIsAddDialogOpen(false);
  };

  const handleEditContact = (contact: Contact) => {
    setEditingContact(contact);
    setIsAddDialogOpen(true);
  };

  const handleDeleteContact = (id: string) => {
    const contactToDelete = contacts.find(contact => contact.id === id);
    setContacts(contacts.filter(contact => contact.id !== id));
    toast({
      title: "Contact Removed",
      description: `${contactToDelete?.name || "Contact"} has been removed.`,
    });
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
          {contacts.length === 0 ? (
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
