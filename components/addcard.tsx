"use client";
import type React from "react"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { addCardServer } from "@/action/action";
import { useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

// Card validation schema
const formSchema = z.object({
  cardNumber: z
    .string()
    .min(13, { message: "Card number must be at least 13 digits" })
    .max(19, { message: "Card number cannot exceed 19 digits" })
    .regex(/^[0-9\s]+$/, { message: "Card number must contain only digits" })
    .refine((val) => luhnCheck(val.replace(/\s/g, "")), {
      message: "Invalid card number",
    }),

  expiryDate: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, {
      message: "Expiry date must be in MM/YY format",
    })
    .refine((val) => {
      const [month, year] = val.split("/");
      const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);
      const today = new Date();
      return expiry > today;
    }, { message: "Card has expired" }),

  cvv: z
    .string()
    .min(3, { message: "CVV must be at least 3 digits" })
    .max(4, { message: "CVV cannot exceed 4 digits" })
    .regex(/^[0-9]+$/, { message: "CVV must contain only digits" }),
});

// Luhn Algorithm for card number validation
function luhnCheck(cardNumber: string): boolean {
  const digits = cardNumber.split("").map(Number);
  let sum = 0;
  let isEven = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = digits[i];

    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
}

// Format card number with spaces
function formatCardNumber(value: string): string {
  return value.replace(/\s/g, "").replace(/(.{4})/g, "$1 ").trim();
}

export function AddCard() {
  const { user } = useUser();
  const [showCVV, setShowCVV] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cardNumber: "",
      expiryDate: "",
      cvv: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user?.id) {
      toast.error("You must be logged in to add a card");
      return;
    }

    try {
      setIsSubmitting(true);

      // Remove spaces from card number before sending
      const cleanCardNumber = values.cardNumber.replace(/\s/g, "");

      await addCardServer(cleanCardNumber, values.expiryDate, values.cvv, user.id);
      toast.success("Card added successfully!");
      form.reset();
    } catch (error) {
      toast.error("Failed to add card. Please try again.");
      console.error("Error adding card:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Add New Card</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="cardNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Card Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      {...field}
                      onChange={(e) => field.onChange(formatCardNumber(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="expiryDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expiry Date</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="MM/YY"
                      maxLength={5}
                      {...field}
                      onChange={(e) => {
                        let value = e.target.value;
                        if (value.length === 2 && !value.includes("/")) {
                          value += "/";
                        }
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cvv"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CVV</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="123"
                        maxLength={4}
                        type={showCVV ? "text" : "password"}
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                        onClick={() => setShowCVV(!showCVV)}
                      >
                        {showCVV ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Adding Card..." : "Add Card"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
