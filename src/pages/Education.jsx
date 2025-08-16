import React, { useState, useEffect } from "react";
import { EducationResource, PatientResourceEngagement, Patient } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  Video, 
  FileText, 
  Search, 
  Filter, 
  Star,
  Clock,
  PlayCircle,
  Award,
  Lightbulb,
  Heart,
  Target,
  TrendingUp
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

const ResourceCard = ({ resource, engagement, onView, onLike }) => {
  const getResourceIcon = (type) => {
    const icons = {
      article: FileText,
      video: Video,
      animation: PlayCircle,
      infographic: BookOpen,
      faq: Lightbulb,
      course: Award,
      module: Target
    };
    
    const Icon = icons[type] || FileText;
    return <Icon className="w-5 h-5" />;
  };

  const getDifficultyColor = (level) => {
    const colors = {
      beginner: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
      intermediate: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
      advanced: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
    };
    return colors[level] || colors.beginner;
  };

  const getEvidenceColor = (level) => {
    const colors = {
      general_advice: "bg-warm-gray-100 text-warm-gray-700 dark:bg-warm-gray-700 dark:text-warm-gray-300",
      evidence_based_summary: "bg-ocean-100 text-ocean-700 dark:bg-ocean-900 dark:text-ocean-300",
      clinical_guideline: "bg-sage-100 text-sage-700 dark:bg-sage-900 dark:text-sage-300",
      research_paper: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
    };
    return colors[level] || colors.general_advice;
  };

  return (
    <Card className="h-full border-sage-200 dark:border-warm-gray-600 hover:shadow-lg transition-all duration-300 bg-white dark:bg-warm-gray-800 group">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 bg-sage-100 dark:bg-sage-800 rounded-xl flex items-center justify-center text-sage-600 dark:text-sage-400">
              {getResourceIcon(resource.type)}
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg text-warm-gray-900 dark:text-warm-gray-100 leading-tight line-clamp-2">
                {resource.title}
              </CardTitle>
              <p className="text-sm text-warm-gray-600 dark:text-warm-gray-400 capitalize">
                {resource.type.replace('_', ' ')}
              </p>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onLike(resource.id)}
            className={`flex-shrink-0 ${engagement?.liked ? 'text-red-500' : 'text-warm-gray-400'}`}
          >
            <Heart className={`w-4 h-4 ${engagement?.liked ? 'fill-current' : ''}`} />
          </Button>
        </div>

        {/* Tags and Badges */}
        <div className="flex flex-wrap gap-2 mt-3">
          {resource.difficulty_level && (
            <Badge className={`text-xs ${getDifficultyColor(resource.difficulty_level)}`}>
              {resource.difficulty_level}
            </Badge>
          )}
          
          {resource.evidence_level && (
            <Badge className={`text-xs ${getEvidenceColor(resource.evidence_level)}`}>
              {resource.evidence_level.replace(/_/g, ' ')}
            </Badge>
          )}
          
          {resource.body_regions && resource.body_regions.slice(0, 2).map((region, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {region.replace('_', ' ')}
            </Badge>
          ))}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Description */}
        <p className="text-sm text-warm-gray-600 dark:text-warm-gray-400 line-clamp-3">
          {resource.description}
        </p>

        {/* Progress for Courses */}
        {resource.type === 'course' && engagement?.progress_percentage !== undefined && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-warm-gray-600 dark:text-warm-gray-400">Progress</span>
              <span className="font-medium text-warm-gray-700 dark:text-warm-gray-300">
                {engagement.progress_percentage}%
              </span>
            </div>
            <Progress value={engagement.progress_percentage} className="h-2" />
          </div>
        )}

        {/* Course Info */}
        {resource.course_modules && (
          <div className="flex items-center gap-4 text-xs text-warm-gray-500 dark:text-warm-gray-400">
            <div className="flex items-center gap-1">
              <PlayCircle className="w-3 h-3" />
              <span>{resource.course_modules.length} modules</span>
            </div>
            {resource.course_modules.reduce((total, module) => total + (module.duration_minutes || 0), 0) > 0 && (
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>
                  {Math.round(resource.course_modules.reduce((total, module) => total + (module.duration_minutes || 0), 0) / 60)}h
                </span>
              </div>
            )}
          </div>
        )}

        {/* Engagement Stats */}
        {engagement && (
          <div className="flex items-center justify-between text-xs text-warm-gray-500 dark:text-warm-gray-400">
            {engagement.view_count > 0 && (
              <span>Viewed {engagement.view_count} times</span>
            )}
            {engagement.completed && (
              <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 text-xs">
                Completed
              </Badge>
            )}
          </div>
        )}

        {/* Action Button */}
        <Button 
          className="w-full bg-sage-600 hover:bg-sage-700 text-white group-hover:shadow-md transition-all duration-200"
          onClick={() => onView(resource)}
        >
          {resource.type === 'course' ? (
            engagement?.progress_percentage > 0 ? 'Continue Course' : 'Start Course'
          ) : (
            engagement?.view_count > 0 ? 'View Again' : 'View Resource'
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

const RecommendedSection = ({ resources, engagements, onView, onLike }) => {
  if (resources.length === 0) return null;

  return (
    <Card className="border-sage-200 dark:border-warm-gray-600 bg-gradient-to-r from-sage-50 to-mint-50 dark:from-sage-900 dark:to-warm-gray-800">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-sage-600 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl text-warm-gray-900 dark:text-warm-gray-100">
              Recommended For You
            </CardTitle>
            <p className="text-warm-gray-600 dark:text-warm-gray-400">
              Personalized content based on your health profile
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resources.slice(0, 3).map((resource) => (
            <div key={resource.id} className="bg-white dark:bg-warm-gray-800 rounded-lg p-4 border border-sage-200 dark:border-warm-gray-600">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-sage-100 dark:bg-sage-800 rounded-lg flex items-center justify-center text-sage-600 dark:text-sage-400">
                  {React.createElement(
                    resource.type === 'video' ? Video : 
                    resource.type === 'course' ? Award : FileText, 
                    { className: "w-4 h-4" }
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-warm-gray-900 dark:text-warm-gray-100 text-sm line-clamp-1">
                    {resource.title}
                  </h4>
                  <p className="text-xs text-warm-gray-600 dark:text-warm-gray-400 capitalize">
                    {resource.type.replace('_', ' ')}
                  </p>
                </div>
              </div>
              <p className="text-xs text-warm-gray-600 dark:text-warm-gray-400 line-clamp-2 mb-3">
                {resource.description}
              </p>
              <Button 
                size="sm" 
                className="w-full bg-sage-600 hover:bg-sage-700 text-white"
                onClick={() => onView(resource)}
              >
                View
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default function Education() {
  const [resources, setResources] = useState([]);
  const [engagements, setEngagements] = useState({});
  const [filteredResources, setFilteredResources] = useState([]);
  const [recommendedResources, setRecommendedResources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBodyRegion, setSelectedBodyRegion] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  
  useEffect(() => {
    loadEducationData();
  }, []);

  useEffect(() => {
    filterResources();
  }, [resources, searchTerm, selectedBodyRegion, selectedType, selectedDifficulty]);

  const loadEducationData = async () => {
    setIsLoading(true);
    try {
      const [fetchedResources, fetchedEngagements, patientData] = await Promise.all([
        EducationResource.list(),
        PatientResourceEngagement.list(),
        Patient.list()
      ]);
      
      setResources(fetchedResources);
      
      // Convert engagements to a lookup object
      const engagementLookup = {};
      fetchedEngagements.forEach(engagement => {
        engagementLookup[engagement.resource_id] = engagement;
      });
      setEngagements(engagementLookup);

      // Generate recommendations based on patient profile
      if (patientData.length > 0) {
        const patient = patientData[0];
        const recommended = generateRecommendations(fetchedResources, patient);
        setRecommendedResources(recommended);
      }
      
    } catch (error) {
      console.error("Error loading education data:", error);
    }
    setIsLoading(false);
  };

  const generateRecommendations = (allResources, patient) => {
    // Simple recommendation logic - in a real app this would be more sophisticated
    let recommended = [];
    
    // Filter based on patient's care pathway and primary issues
    if (patient.care_pathway === 'chronic_pain') {
      recommended = allResources.filter(resource => 
        resource.topics?.includes('pain_science') ||
        resource.topics?.includes('self_management') ||
        resource.related_diagnosis?.includes('chronic_pain')
      );
    } else if (patient.care_pathway === 'post_operative') {
      recommended = allResources.filter(resource => 
        resource.topics?.includes('postoperative_care') ||
        resource.topics?.includes('exercise_fundamentals')
      );
    } else {
      // Default recommendations for general users
      recommended = allResources.filter(resource => 
        resource.topics?.includes('pain_science') ||
        resource.difficulty_level === 'beginner'
      );
    }
    
    return recommended.slice(0, 6); // Limit to 6 recommendations
  };

  const filterResources = () => {
    let filtered = [...resources];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(resource =>
        resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.topics?.some(topic => 
          topic.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Body region filter
    if (selectedBodyRegion !== "all") {
      filtered = filtered.filter(resource => 
        resource.body_regions?.includes(selectedBodyRegion)
      );
    }

    // Type filter
    if (selectedType !== "all") {
      filtered = filtered.filter(resource => resource.type === selectedType);
    }

    // Difficulty filter
    if (selectedDifficulty !== "all") {
      filtered = filtered.filter(resource => resource.difficulty_level === selectedDifficulty);
    }

    setFilteredResources(filtered);
  };

  const handleViewResource = (resource) => {
    // In a real app, this would open the resource in a modal, new page, or external link
    // For now, we'll simulate viewing and update engagement
    updateEngagement(resource.id, 'view');
    
    if (resource.content_url) {
      window.open(resource.content_url, '_blank');
    } else {
      alert(`Opening ${resource.title}. This would navigate to the resource content.`);
    }
  };

  const handleLikeResource = (resourceId) => {
    updateEngagement(resourceId, 'like');
  };

  const updateEngagement = async (resourceId, action) => {
    try {
      const currentEngagement = engagements[resourceId];
      
      if (action === 'view') {
        const newEngagement = {
          resource_id: resourceId,
          patient_id: "current_patient", // In real app, get from auth
          view_count: (currentEngagement?.view_count || 0) + 1,
          last_viewed_at: new Date().toISOString()
        };
        
        if (currentEngagement) {
          await PatientResourceEngagement.update(currentEngagement.id, newEngagement);
        } else {
          await PatientResourceEngagement.create(newEngagement);
        }
      } else if (action === 'like') {
        const newEngagement = {
          resource_id: resourceId,
          patient_id: "current_patient",
          liked: !currentEngagement?.liked,
          ...currentEngagement
        };
        
        if (currentEngagement) {
          await PatientResourceEngagement.update(currentEngagement.id, newEngagement);
        } else {
          await PatientResourceEngagement.create(newEngagement);
        }
      }
      
      // Refresh engagements
      const fetchedEngagements = await PatientResourceEngagement.list();
      const engagementLookup = {};
      fetchedEngagements.forEach(engagement => {
        engagementLookup[engagement.resource_id] = engagement;
      });
      setEngagements(engagementLookup);
      
    } catch (error) {
      console.error("Error updating engagement:", error);
    }
  };

  const uniqueBodyRegions = [...new Set(resources.flatMap(r => r.body_regions || []))];
  const uniqueTypes = [...new Set(resources.map(r => r.type))];
  const uniqueDifficulties = [...new Set(resources.map(r => r.difficulty_level).filter(Boolean))];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Breadcrumb Navigation */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink to={createPageUrl("Dashboard")}>Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Learn & Resources</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-warm-gray-900 dark:text-warm-gray-100">
          Learn & Resources
        </h1>
        <p className="text-lg text-warm-gray-600 dark:text-warm-gray-400 max-w-3xl mx-auto">
          Evidence-based educational content to support your recovery journey and empower your understanding of health and wellness
        </p>
      </div>

      {/* Recommended Resources */}
      <RecommendedSection 
        resources={recommendedResources}
        engagements={engagements}
        onView={handleViewResource}
        onLike={handleLikeResource}
      />

      {/* Search and Filters */}
      <Card className="border-sage-200 dark:border-warm-gray-600 bg-white dark:bg-warm-gray-800">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-warm-gray-400" />
              <Input
                placeholder="Search resources by title, topic, or keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white dark:bg-warm-gray-700 border-sage-200 dark:border-warm-gray-600"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-warm-gray-500" />
                <Select value={selectedBodyRegion} onValueChange={setSelectedBodyRegion}>
                  <SelectTrigger className="w-40 bg-white dark:bg-warm-gray-700">
                    <SelectValue placeholder="Body Region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Regions</SelectItem>
                    {uniqueBodyRegions.map(region => (
                      <SelectItem key={region} value={region}>
                        {region.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-36 bg-white dark:bg-warm-gray-700">
                  <SelectValue placeholder="Content Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {uniqueTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger className="w-36 bg-white dark:bg-warm-gray-700">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  {uniqueDifficulties.map(difficulty => (
                    <SelectItem key={difficulty} value={difficulty}>
                      {difficulty.replace(/\b\w/g, l => l.toUpperCase())}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-sage-200 dark:border-warm-gray-600">
            <p className="text-sm text-warm-gray-600 dark:text-warm-gray-400">
              {filteredResources.length} resource{filteredResources.length !== 1 ? 's' : ''} found
            </p>
            <HelpTooltip content="Use search and filters to find specific content. Click the heart icon to save resources to your favorites." />
          </div>
        </CardContent>
      </Card>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((resource) => (
          <ResourceCard
            key={resource.id}
            resource={resource}
            engagement={engagements[resource.id]}
            onView={handleViewResource}
            onLike={handleLikeResource}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredResources.length === 0 && (
        <Card className="border-sage-200 dark:border-warm-gray-600">
          <CardContent className="p-12 text-center">
            <BookOpen className="w-16 h-16 text-warm-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-warm-gray-900 dark:text-warm-gray-100 mb-2">
              No resources found
            </h3>
            <p className="text-warm-gray-600 dark:text-warm-gray-400 mb-6">
              Try adjusting your search terms or filters to find more educational content.
            </p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm("");
                setSelectedBodyRegion("all");
                setSelectedType("all");
                setSelectedDifficulty("all");
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