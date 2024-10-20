import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';

interface PremiumCardProps {
  price: number;  // price for the premium
  onPurchase: () => void;  // function to handle purchase
}

const PremiumCard: React.FC<PremiumCardProps> = ({ price, onPurchase }) => {
  return (
    <div className='w-full flex justify-center items-center py-8'>
      <Card className='max-w-md w-full text-center shadow-xl rounded-lg'>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800">TcharGram Premium</CardTitle>
        </CardHeader>
        <CardContent className="px-6 py-4">
          <p className="text-gray-600">Unlock exclusive features with our premium subscription!</p>
          <p className="text-lg font-bold mt-4">${price}/month for premium</p>
          <Button 
            onClick={onPurchase} 
            className="mt-6 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 ease-in-out shadow-md hover:shadow-lg"
          >
            Pay ${price}/month
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PremiumCard;
