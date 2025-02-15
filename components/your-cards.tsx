import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface Cardprops{
  cardno : string,
  expiry : string,
  cvv : number
}

export function YourCards({cards}: {cards :Cardprops[]}) {
  return (
   <Card>
    <CardHeader>
      <CardTitle>Your Cards</CardTitle>
    </CardHeader>
    <CardContent>
      <ul className="space-y-2">
        {cards.map((card: Cardprops)=>(
          <li key={card.cardno} className="flex justify-between items-center p-2 bg-secondary roundend">
            <span>{card.cardno}</span>
            <span>{card.expiry}</span>
            <span>{card.cvv}</span>
          </li>
        ))}
      </ul>
    </CardContent>
   </Card>
  )
}

