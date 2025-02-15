import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock } from "lucide-react"
import Link from "next/link"

interface Password {
  website: string,
  username: string,
  password: string
}

// Fixed prop type definition
export function Yourpasswords({ passwords }: { passwords: Password[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {passwords.map((password) => (
      
        <Card key={password.website}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            
            <Link href={password.website} target="_blank">
           
            <CardTitle className="text-sm font-medium cursor-pointer text-blue-600 underline">{password.website}</CardTitle>
            </Link>
            <Lock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
         
            <CardDescription>Username : {password.username}</CardDescription>
          </CardContent>
          <CardContent>
            <CardDescription>Password : {password.password}</CardDescription>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}