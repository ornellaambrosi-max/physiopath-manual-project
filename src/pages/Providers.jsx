import React, { useState, useEffect } from "react";
import { HealthcareProvider } from "@/entities/HealthcareProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Star, 
  Filter, 
  Search,
  Clock,
  Award,
  Calendar,
  Globe,
  Users,
  Stethoscope
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { createPageUrl } from "@/utils";
import { HelpTooltip } from "../components/common/Tooltip";

// Mock map component (in a real app, this would be React Leaflet)
const ProvidersMap = ({ providers, selectedProvider, onProviderSelect }) => {
  return (
    <div className="w-full h-96 bg-gradient-to-br from-sage-50 to-ocean-50 dark:from-warm-gray-800 dark:to-warm-gray-700 rounded-xl border border-sage-200 dark:border-warm-gray-600 flex items-center justify-center">
      <div className="text-center p-8">
        <MapPin className="w-12 h-12 text-sage-600 dark:text-sage-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-warm-gray-900 dark:text-warm-gray-100 mb-2">
          Interactive Map View
        </h3>
        <p className="text-warm-gray-600 dark:text-warm-gray-400 mb-4">
          Find healthcare providers near you
        </p>
        <p className="text-sm text-warm-gray-500 dark:text-warm-gray-500">
          Map integration coming soon with React Leaflet
        </p>
      </div>
    </div>
  );
};

const ProviderCard = ({ provider, onBookAppointment }) => {
  const getProviderTypeIcon = (type) => {
    const icons = {
      physiotherapy_clinic: Users,
      orthopedic_surgeon: Stethoscope,
      sports_medicine: Award,
      pain_specialist: Stethoscope,
      rheumatologist: Stethoscope,
      neurologist: Stethoscope,
      hospital: Stethoscope,
      diagnostic_center: Stethoscope
    };
    
    const Icon = icons[type] || Stethoscope;
    return <Icon className="w-5 h-5" />;
  };

  const getProviderTypeLabel = (type) => {
    const labels = {
      physiotherapy_clinic: "Physiotherapy Clinic",
      orthopedic_surgeon: "Orthopedic Surgeon",
      sports_medicine: "Sports Medicine",
      pain_specialist: "Pain Specialist",
      rheumatologist: "Rheumatologist",
      neurologist: "Neurologist",
      hospital: "Hospital",
      diagnostic_center: "Diagnostic Center"
    };
    
    return labels[type] || type.replace('_', ' ');
  };

  return (
    <Card className="h-full border-sage-200 dark:border-warm-gray-600 hover:shadow-lg transition-all duration-300 bg-white dark:bg-warm-gray-800">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-sage-100 dark:bg-sage-800 rounded-xl flex items-center justify-center text-sage-600 dark:text-sage-400">
              {getProviderTypeIcon(provider.provider_type)}
            </div>
            <div>
              <CardTitle className="text-lg text-warm-gray-900 dark:text-warm-gray-100 leading-tight">
                {provider.name}
              </CardTitle>
              <p className="text-sm text-warm-gray-600 dark:text-warm-gray-400">
                {getProviderTypeLabel(provider.provider_type)}
              </p>
            </div>
          </div>
          {provider.rating && (
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-amber-400 fill-current" />
              <span className="text-sm font-medium text-warm-gray-700 dark:text-warm-gray-300">
                {provider.rating.toFixed(1)}
              </span>
            </div>
          )}
        </div>

        {/* Specializations */}
        {provider.specializations && provider.specializations.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {provider.specializations.slice(0, 3).map((spec, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="bg-sage-100 dark:bg-sage-800 text-sage-700 dark:text-sage-300 text-xs"
              >
                {spec}
              </Badge>
            ))}
            {provider.specializations.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{provider.specializations.length - 3} more
              </Badge>
            )}
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Contact Information */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-warm-gray-600 dark:text-warm-gray-400">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span>{provider.city}, {provider.region}</span>
          </div>
          
          {provider.phone && (
            <div className="flex items-center gap-2 text-sm text-warm-gray-600 dark:text-warm-gray-400">
              <Phone className="w-4 h-4 flex-shrink-0" />
              <a 
                href={`tel:${provider.phone}`} 
                className="hover:text-sage-600 dark:hover:text-sage-400 transition-colors"
              >
                {provider.phone}
              </a>
            </div>
          )}
          
          {provider.email && (
            <div className="flex items-center gap-2 text-sm text-warm-gray-600 dark:text-warm-gray-400">
              <Mail className="w-4 h-4 flex-shrink-0" />
              <a 
                href={`mailto:${provider.email}`} 
                className="hover:text-sage-600 dark:hover:text-sage-400 transition-colors"
              >
                {provider.email}
              </a>
            </div>
          )}
        </div>

        {/* Additional Info */}
        <div className="flex items-center justify-between text-xs text-warm-gray-500 dark:text-warm-gray-400">
          {provider.avg_wait_time && (
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{provider.avg_wait_time}</span>
            </div>
          )}
          
          {provider.languages_spoken && provider.languages_spoken.length > 0 && (
            <div className="flex items-center gap-1">
              <Globe className="w-3 h-3" />
              <span>{provider.languages_spoken.join(", ")}</span>
            </div>
          )}
        </div>

        {/* Description */}
        {provider.description && (
          <p className="text-sm text-warm-gray-600 dark:text-warm-gray-400 line-clamp-2">
            {provider.description}
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button 
            className="flex-1 bg-sage-600 hover:bg-sage-700 text-white"
            onClick={() => onBookAppointment(provider)}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Book Appointment
          </Button>
          <Button variant="outline" size="icon" className="flex-shrink-0">
            <Phone className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default function Providers() {
  const [providers, setProviders] = useState([]);
  const [filteredProviders, setFilteredProviders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "map"

  useEffect(() => {
    loadProviders();
  }, []);

  useEffect(() => {
    filterProviders();
  }, [providers, searchTerm, selectedRegion, selectedSpecialty]);

  const loadProviders = async () => {
    setIsLoading(true);
    try {
      const fetchedProviders = await HealthcareProvider.list();
      setProviders(fetchedProviders);
    } catch (error) {
      console.error("Error loading providers:", error);
    }
    setIsLoading(false);
  };

  const filterProviders = () => {
    let filtered = [...providers];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(provider =>
        provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        provider.specializations?.some(spec => 
          spec.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        provider.city.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Region filter
    if (selectedRegion !== "all") {
      filtered = filtered.filter(provider => provider.region === selectedRegion);
    }

    // Specialty filter
    if (selectedSpecialty !== "all") {
      filtered = filtered.filter(provider => 
        provider.provider_type === selectedSpecialty ||
        provider.specializations?.includes(selectedSpecialty)
      );
    }

    setFilteredProviders(filtered);
  };

  const handleBookAppointment = (provider) => {
    // In a real app, this would open a booking modal or redirect to booking page
    alert(`Booking appointment with ${provider.name}. This feature will be implemented with a booking system.`);
  };

  const uniqueRegions = [...new Set(providers.map(p => p.region))].filter(Boolean);
  const uniqueSpecialties = [
    ...new Set([
      ...providers.map(p => p.provider_type),
      ...providers.flatMap(p => p.specializations || [])
    ])
  ].filter(Boolean);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink to={createPageUrl("Dashboard")}>Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Healthcare Providers</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-warm-gray-900 dark:text-warm-gray-100">
          Find Healthcare Providers
        </h1>
        <p className="text-lg text-warm-gray-600 dark:text-warm-gray-400 max-w-3xl mx-auto">
          Connect with trusted healthcare professionals in your area who specialize in musculoskeletal care and rehabilitation
        </p>
      </div>

      {/* Search and Filters */}
      <Card className="border-sage-200 dark:border-warm-gray-600 bg-white dark:bg-warm-gray-800">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-warm-gray-400" />
              <Input
                placeholder="Search by name, specialty, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white dark:bg-warm-gray-700 border-sage-200 dark:border-warm-gray-600"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-warm-gray-500" />
                <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                  <SelectTrigger className="w-40 bg-white dark:bg-warm-gray-700">
                    <SelectValue placeholder="All Regions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Regions</SelectItem>
                    {uniqueRegions.map(region => (
                      <SelectItem key={region} value={region}>
                        {region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                <SelectTrigger className="w-48 bg-white dark:bg-warm-gray-700">
                  <SelectValue placeholder="All Specialties" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Specialties</SelectItem>
                  {uniqueSpecialties.map(specialty => (
                    <SelectItem key={specialty} value={specialty}>
                      {specialty.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* View Toggle */}
            <div className="flex bg-warm-gray-100 dark:bg-warm-gray-700 rounded-lg p-1">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className={viewMode === "grid" ? "bg-white dark:bg-warm-gray-600 shadow-sm" : ""}
              >
                Grid
              </Button>
              <Button
                variant={viewMode === "map" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("map")}
                className={viewMode === "map" ? "bg-white dark:bg-warm-gray-600 shadow-sm" : ""}
              >
                Map
              </Button>
            </div>
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-sage-200 dark:border-warm-gray-600">
            <p className="text-sm text-warm-gray-600 dark:text-warm-gray-400">
              {filteredProviders.length} provider{filteredProviders.length !== 1 ? 's' : ''} found
            </p>
            <HelpTooltip content="Use filters to narrow down providers by location and specialty. Click 'Book Appointment' to schedule directly." />
          </div>
        </CardContent>
      </Card>

      {/* Content Area */}
      {viewMode === "map" ? (
        <ProvidersMap 
          providers={filteredProviders}
          selectedProvider={selectedProvider}
          onProviderSelect={setSelectedProvider}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProviders.map((provider) => (
            <ProviderCard
              key={provider.id}
              provider={provider}
              onBookAppointment={handleBookAppointment}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredProviders.length === 0 && (
        <Card className="border-sage-200 dark:border-warm-gray-600">
          <CardContent className="p-12 text-center">
            <Users className="w-16 h-16 text-warm-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-warm-gray-900 dark:text-warm-gray-100 mb-2">
              No providers found
            </h3>
            <p className="text-warm-gray-600 dark:text-warm-gray-400 mb-6">
              Try adjusting your search terms or filters to find more providers in your area.
            </p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm("");
                setSelectedRegion("all");
                setSelectedSpecialty("all");
              }}
            >
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}