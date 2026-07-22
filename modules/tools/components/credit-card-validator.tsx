"use client";

import * as React from "react";
import { CheckCircle2Icon, XCircleIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

function luhnValid(digits: string) {
  let sum = 0;
  let alt = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = digits.charCodeAt(i) - 48;
    if (alt) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
}

function detectBrand(d: string): string {
  if (/^4/.test(d)) return "Visa";
  if (/^(5[1-5]|2(2[2-9]|[3-6]\d|7[01]|720))/.test(d)) return "Mastercard";
  if (/^3[47]/.test(d)) return "American Express";
  if (/^(6011|65|64[4-9])/.test(d)) return "Discover";
  if (/^3(0[0-5]|[68])/.test(d)) return "Diners Club";
  if (/^35/.test(d)) return "JCB";
  return "Unknown";
}

export function CreditCardValidator() {
  const [value, setValue] = React.useState("");

  const digits = value.replace(/\D/g, "");
  const hasInput = digits.length > 0;
  const valid = hasInput && digits.length >= 12 && luhnValid(digits);
  const brand = hasInput ? detectBrand(digits) : "";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="cc">Card number</Label>
        <Input
          id="cc"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="4242 4242 4242 4242"
          inputMode="numeric"
          className="font-mono"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={() => setValue("4242 4242 4242 4242")}>Try example</Button>
        <Button variant="ghost" size="sm" onClick={() => setValue("")}>Clear</Button>
      </div>

      {hasInput && (
        <Card>
          <CardContent className="flex flex-col gap-3 py-4">
            <div className="flex items-center gap-2">
              {valid ? (
                <>
                  <CheckCircle2Icon className="size-5 text-emerald-500" />
                  <span className="font-medium">Passes the Luhn check</span>
                </>
              ) : (
                <>
                  <XCircleIcon className="size-5 text-destructive" />
                  <span className="font-medium">Fails the Luhn check</span>
                </>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <div className="text-xs text-muted-foreground">Card type</div>
                <div className="font-medium">{brand}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Digits</div>
                <div className="font-medium">{digits.length}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <p className="text-xs text-muted-foreground">
        This checks the number&apos;s format (Luhn checksum) and brand only — it can&apos;t tell whether
        a card is real or active. Everything runs in your browser; nothing is sent anywhere.
      </p>
    </div>
  );
}
