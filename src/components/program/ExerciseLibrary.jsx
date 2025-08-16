import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Play, 
  Clock, 
  Target,
  Filter,
  Dumbbell
} from "lucide-react";

export default function ExerciseLibrary({ currentProgram }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const exercises = currentProgram?.exercises || [];

  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exercise.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || exercise.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(exercises.map(ex => ex.category))];

  const getCategoryIcon = (category) => {
    const icons = {
      strength: "💪",
      flexibility: "🤸",
      mobility: "🔄",
      balance: "⚖️",
      endurance: "🏃",
      coordination: "🎯"
    };
    return icons[category] || "🏋️";
  };

  const getCategoryColor = (category) => {
    const colors = {
      strength: "bg-red-100 text-red-800",
      flexibility: "bg-green-100 text-green-800",
      mobility: "bg-blue-100 text-blue-800",
      balance: "bg-purple-100 text-purple-800",
      endurance: "bg-orange-100 text-orange-800",
      coordination: "bg-pink-100 text-pink-800"
    };
    return colors[category] || "bg-warm-gray-100 text-warm-gray-800";
  };

  if (!currentProgram || !exercises.length) {
    return (
      <Card className="border-sage-200 shadow-md">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-warm-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Dumbbell className="w-8 h-8 text-warm-gray-400" />
          </div>
          <h3 className="font-semibold text-warm-gray-900 mb-2">No Exercises Available</h3>
          <p className="text-warm-gray-600">
            Complete your screening to get a personalized exercise program with a full library of exercises.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <Card className="border-sage-200 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-warm-gray-400" />
              <Input
                placeholder="Search exercises..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={selectedCategory === "all" ? "default" : "outline"}
                onClick={() => setSelectedCategory("all")}
                size="sm"
              >
                All
              </Button>
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  size="sm"
                  className="hidden sm:flex"
                >
                  {getCategoryIcon(category)} {category}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Exercise Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExercises.map((exercise, index) => (
          <Card key={exercise.id || index} className="border-sage-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg text-warm-gray-900 leading-tight">
                    {exercise.name}
                  </CardTitle>
                  <div className="flex flex-wrap gap-1 mt-2">
                    <Badge className={getCategoryColor(exercise.category)}>
                      {getCategoryIcon(exercise.category)} {exercise.category}
                    </Badge>
                    {exercise.difficulty_level && (
                      <Badge variant="outline">
                        {exercise.difficulty_level}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Exercise Preview */}
              {exercise.video_url && (
                <div className="aspect-video bg-warm-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Play className="w-8 h-8 text-warm-gray-400 mx-auto mb-2" />
                    <p className="text-xs text-warm-gray-500">Video Demo</p>
                  </div>
                </div>
              )}

              {/* Exercise Details */}
              <div className="space-y-3">
                <p className="text-sm text-warm-gray-700 line-clamp-2">
                  {exercise.description}
                </p>

                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="p-2 bg-warm-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-warm-gray-900">
                      {exercise.initial_sets || exercise.default_sets} sets
                    </p>
                    <p className="text-xs text-warm-gray-600">Sets</p>
                  </div>
                  <div className="p-2 bg-warm-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-warm-gray-900">
                      {exercise.initial_reps || exercise.default_reps}
                    </p>
                    <p className="text-xs text-warm-gray-600">Reps</p>
                  </div>
                </div>

                {/* Target Muscles */}
                {exercise.target_muscles && exercise.target_muscles.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-warm-gray-700 mb-1">Targets:</p>
                    <div className="flex flex-wrap gap-1">
                      {exercise.target_muscles.slice(0, 3).map((muscle, muscleIndex) => (
                        <Badge key={muscleIndex} variant="outline" className="text-xs">
                          {muscle}
                        </Badge>
                      ))}
                      {exercise.target_muscles.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{exercise.target_muscles.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Equipment */}
                {exercise.equipment && exercise.equipment.length > 0 && exercise.equipment[0] !== "none" && (
                  <div>
                    <p className="text-xs font-medium text-warm-gray-700 mb-1">Equipment:</p>
                    <div className="flex flex-wrap gap-1">
                      {exercise.equipment.map((item, itemIndex) => (
                        <Badge key={itemIndex} variant="outline" className="text-xs bg-mint-50">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <Button className="w-full bg-sage-600 hover:bg-sage-700" disabled>
                <Play className="w-4 h-4 mr-2" />
                View Exercise
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredExercises.length === 0 && (
        <Card className="border-sage-200">
          <CardContent className="p-8 text-center">
            <Target className="w-12 h-12 text-warm-gray-400 mx-auto mb-4" />
            <h3 className="font-semibold text-warm-gray-900 mb-2">No exercises found</h3>
            <p className="text-warm-gray-600">
              Try adjusting your search terms or category filter.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}