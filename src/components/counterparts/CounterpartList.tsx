import { useState, useEffect } from 'react';
import { useCounterparts } from '@/hooks/useCounterparts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Search, Building2, User } from 'lucide-react';
import type { CounterpartResponse } from '@monite/sdk-api';

export function CounterpartList() {
  const { list, loading } = useCounterparts();
  const [counterparts, setCounterparts] = useState<CounterpartResponse[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadCounterparts();
  }, []);

  const loadCounterparts = async () => {
    const data = await list();
    setCounterparts(data);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Contacts</h2>
        <Button data-testid="add-contact-button" onClick={() => setShowAddForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Contact
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search contacts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {loading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-4">
              <div className="animate-pulse flex items-center gap-4">
                <div className="w-10 h-10 bg-muted rounded-full" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-muted rounded w-1/4" />
                  <div className="h-3 bg-muted rounded w-1/3" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : counterparts.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="flex flex-col items-center gap-2">
            {searchQuery ? (
              <>
                <p className="text-muted-foreground">No contacts found matching "{searchQuery}"</p>
                <Button variant="link" onClick={() => setSearchQuery('')}>
                  Clear search
                </Button>
              </>
            ) : (
              <>
                <Building2 className="h-8 w-8 text-muted-foreground mb-2" />
                <h3 className="font-medium">No contacts yet</h3>
                <p className="text-muted-foreground">Add your first client or vendor to get started</p>
                <Button className="mt-4" onClick={() => setShowAddForm(true)}>
                  Add Contact
                </Button>
              </>
            )}
          </div>
        </Card>
      ) : (
        <div className="grid gap-4">
          {counterparts.map((counterpart) => (
            <Card key={counterpart.id} className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  {counterpart.type === 'organization' ? (
                    <Building2 className="h-5 w-5 text-primary" />
                  ) : (
                    <User className="h-5 w-5 text-primary" />
                  )}
                </div>
                <div>
                  <p className="font-medium">
                    {counterpart.type === 'organization'
                      ? counterpart.organization?.name
                      : `${counterpart.individual?.first_name} ${counterpart.individual?.last_name}`}
                  </p>
                  <p className="text-sm text-muted-foreground">{counterpart.email}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Contact</DialogTitle>
          </DialogHeader>
          {/* Form content */}
        </DialogContent>
      </Dialog>
    </div>
  );
}