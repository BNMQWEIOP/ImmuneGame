import React, { useState } from 'react';
import { useImmuneSystem } from '../../lib/stores/useImmuneSystem';
import { Button } from '../../components/ui/button';
import { cn } from '../../lib/utils';
import { immuneResponses } from '../data/immuneResponses';
import useSelectionHandler from '../hooks/useSelectionHandler';
import { ImmuneResponse } from '../types';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Syringe, Worm, Waves } from 'lucide-react';

// Group responses by category for the tabs
const responsesByCategory: Record<string, ImmuneResponse[]> = {
  'innate': immuneResponses.filter(r => r.category === 'innate'),
  'adaptive': immuneResponses.filter(r => r.category === 'adaptive'),
  'molecules': immuneResponses.filter(r => r.category === 'molecules')
};

export default function ResponseSelector() {
  const { 
    selectedResponses, 
    validateSelections,
    getResponseStatus,
    gamePhase
  } = useImmuneSystem();
  
  const { handleSelection } = useSelectionHandler();
  const [activeTab, setActiveTab] = useState('innate');
  
  // Handle response selection
  const onSelectResponse = (response: ImmuneResponse) => {
    console.log("Response selected:", response.name);
    handleSelection(response);
  };
  
  // Handle submit of selections
  const onSubmitSelections = () => {
    console.log("Submitting selections:", selectedResponses);
    validateSelections();
  };
  
  // Disable the component when not in playing phase
  if (gamePhase !== 'playing') {
    return null;
  }
  
  // Helper function to determine if a response is selectable
  const isResponseSelectable = (response: ImmuneResponse) => {
    const status = getResponseStatus(response.id);
    return status !== 'disabled' && status !== 'correct';
  };
  
  return (
    <Card className="fixed bottom-4 left-4 right-4 max-w-4xl mx-auto bg-background/95 backdrop-blur z-30">
      <CardContent className="p-4">
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Select Immune Response</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedResponses.length > 0 ? (
              selectedResponses.map((responseId, index) => {
                const response = immuneResponses.find(r => r.id === responseId);
                const status = getResponseStatus(responseId);
                
                return (
                  <div 
                    key={index}
                    className={cn(
                      "px-4 py-2 rounded-md flex items-center gap-2",
                      status === 'correct' && "bg-green-500/20 text-green-600",
                      status === 'incorrect' && "bg-red-500/20 text-red-600",
                      status === 'pending' && "bg-primary/20 text-primary"
                    )}
                  >
                    <span className="font-medium">{index + 1}.</span>
                    <span>{response?.name}</span>
                  </div>
                );
              })
            ) : (
              <div className="text-muted-foreground italic">No responses selected yet</div>
            )}
          </div>
          
          {selectedResponses.length > 0 && (
            <Button 
              onClick={onSubmitSelections}
              className="bg-primary hover:bg-primary/90 text-white font-semibold px-4 py-2 rounded-md"
              disabled={selectedResponses.some(id => getResponseStatus(id) !== 'pending')}
            >
              Validate Sequence
            </Button>
          )}
        </div>
        
        <Tabs defaultValue="innate" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 z-30 relative">
            <TabsTrigger value="innate" className="flex items-center gap-2">
              <Shield className="h-4 w-4" /> Innate Cells
            </TabsTrigger>
            <TabsTrigger value="adaptive" className="flex items-center gap-2">
              <Syringe className="h-4 w-4" /> Adaptive Cells
            </TabsTrigger>
            <TabsTrigger value="molecules" className="flex items-center gap-2">
              <Waves className="h-4 w-4" /> Molecules
            </TabsTrigger>
          </TabsList>
          
          {Object.entries(responsesByCategory).map(([category, responses]) => (
            <TabsContent key={category} value={category} className="mt-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 relative z-30">
                {responses.map((response) => {
                  const status = getResponseStatus(response.id);
                  
                  return (
                    <Button
                      key={response.id}
                      variant={status === 'correct' ? 'default' : 'outline'}
                      size="lg"
                      className={cn(
                        "h-auto py-3 justify-start",
                        status === 'correct' && "bg-green-500 hover:bg-green-600",
                        status === 'incorrect' && "bg-red-500/20 text-red-600 hover:bg-red-500/30",
                        status === 'disabled' && "opacity-50 cursor-not-allowed"
                      )}
                      onClick={() => isResponseSelectable(response) && onSelectResponse(response)}
                      disabled={!isResponseSelectable(response)}
                    >
                      <div className="flex flex-col items-start">
                        <span className="font-medium">{response.name}</span>
                        <span className="text-xs text-muted-foreground">{response.shortDescription}</span>
                      </div>
                    </Button>
                  );
                })}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
