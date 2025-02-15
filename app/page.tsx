import { SavePassword } from "@/components/addpassword" 
import { addPasswordServer } from "@/action/action"
import { YourCards } from "@/components/your-cards";
import { Yourpasswords } from "@/components/your-passwords";
import type { Metadata } from 'next';
import { currentUser } from "@clerk/nextjs/server";
import { AddCard } from "@/components/addcard";

export const metadata: Metadata = {
  title: 'NO-pass-Home',
  description: 'This is the homepage for your password manager',
};

export default async function Home() { // ✅ FIXED: Made Home async
  const user = await currentUser(); // ✅ FIXED: Await here (server component)
  console.log(user?.privateMetadata);

  // Ensure cards and passwords default to empty arrays
  const cards = Array.isArray(user?.privateMetadata?.cards) ? user.privateMetadata.cards : [];
  const passwords = Array.isArray(user?.privateMetadata?.passwords) ? user.privateMetadata.passwords : [];

  return (
    <div className="container mx-auto p-4 space-y-8">
      {/* Hero Section */}
      <section className="text-center space-y-4">
        <p className="text-lg text-muted-foreground">
          Securely store and manage your passwords & credit card details with ease.
        </p>
      </section>

      
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-primary">Add a credit card</h1>
          <AddCard />
        </div>
        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-primary">Add a password</h1>
          <SavePassword />
        </div>
      </div>

      {/* Your Cards */}
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-primary">Your Cards</h1>
        <YourCards cards={cards} /> 
      </div>

      {/* Your Passwords */}
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-primary">Your Passwords</h1>
        <Yourpasswords passwords={passwords} /> 
      </div>
    </div>
  );
}
