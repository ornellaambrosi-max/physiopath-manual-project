import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { User } from "lucide-react";

const italianRegions = [
  "Abruzzo", "Basilicata", "Calabria", "Campania", "Emilia-Romagna", "Friuli-Venezia Giulia",
  "Lazio", "Liguria", "Lombardia", "Marche", "Molise", "Piemonte", "Puglia", "Sardegna",
  "Sicilia", "Toscana", "Trentino-Alto Adige", "Umbria", "Valle d'Aosta", "Veneto"
];

export default function PersonalInfo({ data, onUpdate }) {
  const personalInfo = data.personalInfo || {};

  const handleChange = (field, value) => {
    onUpdate({ ...personalInfo, [field]: value }, 'personalInfo');
  };

  return (
    <Card className="border-sage-200 shadow-md">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-sage-100 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-sage-600" />
          </div>
          <div>
            <CardTitle className="text-xl text-warm-gray-900">Personal Information</CardTitle>
            <p className="text-warm-gray-600">Help us understand your background and contact details</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="first_name">First Name *</Label>
            <Input
              id="first_name"
              value={personalInfo.first_name || ''}
              onChange={(e) => handleChange('first_name', e.target.value)}
              placeholder="Your first name"
              className="rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="last_name">Last Name *</Label>
            <Input
              id="last_name"
              value={personalInfo.last_name || ''}
              onChange={(e) => handleChange('last_name', e.target.value)}
              placeholder="Your last name"
              className="rounded-xl"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={personalInfo.email || ''}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="your.email@example.com"
              className="rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={personalInfo.phone || ''}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="+39 123 456 7890"
              className="rounded-xl"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="date_of_birth">Date of Birth</Label>
            <Input
              id="date_of_birth"
              type="date"
              value={personalInfo.date_of_birth || ''}
              onChange={(e) => handleChange('date_of_birth', e.target.value)}
              className="rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <Select 
              value={personalInfo.gender || ''} 
              onValueChange={(value) => handleChange('gender', value)}
            >
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
                <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="region">Region</Label>
            <Select 
              value={personalInfo.region || ''} 
              onValueChange={(value) => handleChange('region', value)}
            >
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Select region" />
              </SelectTrigger>
              <SelectContent>
                {italianRegions.map(region => (
                  <SelectItem key={region} value={region}>{region}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={personalInfo.city || ''}
              onChange={(e) => handleChange('city', e.target.value)}
              placeholder="Your city"
              className="rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="postal_code">Postal Code</Label>
            <Input
              id="postal_code"
              value={personalInfo.postal_code || ''}
              onChange={(e) => handleChange('postal_code', e.target.value)}
              placeholder="12345"
              className="rounded-xl"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="medical_history">Medical History</Label>
          <Textarea
            id="medical_history"
            value={personalInfo.medical_history || ''}
            onChange={(e) => handleChange('medical_history', e.target.value)}
            placeholder="Please describe any relevant medical conditions, surgeries, or ongoing health issues..."
            rows={3}
            className="rounded-xl"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="current_medications">Current Medications</Label>
            <Textarea
              id="current_medications"
              value={personalInfo.current_medications || ''}
              onChange={(e) => handleChange('current_medications', e.target.value)}
              placeholder="List any medications you are currently taking..."
              rows={2}
              className="rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="allergies">Allergies</Label>
            <Textarea
              id="allergies"
              value={personalInfo.allergies || ''}
              onChange={(e) => handleChange('allergies', e.target.value)}
              placeholder="List any known allergies..."
              rows={2}
              className="rounded-xl"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}