
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, Edit } from "lucide-react";

export interface Contact {
  id: string;
  name: string;
  phone: string;
}

interface ContactCardProps {
  contact: Contact;
  onDelete: (id: string) => void;
  onEdit: (contact: Contact) => void;
}

const ContactCard = ({ contact, onDelete, onEdit }: ContactCardProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    if (isDeleting) {
      onDelete(contact.id);
    } else {
      setIsDeleting(true);
      setTimeout(() => setIsDeleting(false), 3000);
    }
  };

  return (
    <Card className="animate-fade-in overflow-hidden hover-scale">
      <CardContent className="p-4 flex justify-between items-center">
        <div className="flex-1">
          <h3 className="font-bold text-lg">{contact.name}</h3>
          <p className="text-muted-foreground">{contact.phone}</p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onEdit(contact)}
            className="text-raksha-purple-dark hover:text-raksha-purple hover:border-raksha-purple"
          >
            <Edit className="h-4 w-4" />
          </Button>
          
          <Button
            variant={isDeleting ? "destructive" : "outline"}
            size="icon"
            onClick={handleDelete}
            className={!isDeleting ? "text-red-500 hover:text-white hover:bg-red-500" : ""}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactCard;
