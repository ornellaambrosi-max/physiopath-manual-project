import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SupportRequest, Patient, User } from "@/entities/all";
import { 
  MessageSquare, 
  Video, 
  Phone, 
  Send, 
  BookOpen, 
  Play,
  AlertTriangle,
  CheckCircle,
  Clock,
  Bot
} from "lucide-react";

export default function SupportModal({ isOpen, onClose, context, contextData }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [requestType, setRequestType] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(true);

  useEffect(() => {
    loadUserData();
    generateSuggestions();
  }, [context, contextData]);

  const loadUserData = async () => {
    try {
      const user = await User.me();
      setCurrentUser(user);
    } catch (error) {
      console.error("Error loading user:", error);
    }
  };

  const generateSuggestions = () => {
    // AI-powered suggestions based on context
    const contextSuggestions = {
      dashboard: [
        {
          type: "faq",
          title: "How do I track my progress?",
          content: "Your progress is automatically tracked on the Dashboard. Look for charts showing pain levels, exercise adherence, and functional improvements."
        },
        {
          type: "video",
          title: "Getting Started with PhysioPath",
          content: "Watch this 3-minute guide to navigate your dashboard and start your recovery journey.",
          url: "/help/getting-started"
        }
      ],
      exercise_session: [
        {
          type: "faq",
          title: "Exercise is too difficult",
          content: "You can modify exercises by reducing sets, reps, or range of motion. Look for the 'Make Easier' button on each exercise."
        },
        {
          type: "faq",
          title: "I'm experiencing pain during exercise",
          content: "Stop the exercise immediately if you feel sharp or increasing pain. Mild discomfort is normal, but pain is not."
        },
        {
          type: "exercise",
          title: "Alternative exercises",
          content: "Here are gentler alternatives for your current exercise program."
        }
      ],
      exercise_detail: [
        {
          type: "video",
          title: "Proper form demonstration",
          content: "Watch this detailed breakdown of correct exercise technique."
        }
      ],
      screening: [
        {
          type: "faq",
          title: "Understanding your pain map",
          content: "The body chart helps us understand exactly where you feel symptoms. Click on areas that hurt and describe the sensation."
        }
      ]
    };

    setSuggestions(contextSuggestions[context] || []);
  };

  const handleSubmitRequest = async () => {
    if (!requestType || !subject || !message) {
      alert("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      await SupportRequest.create({
        patient_id: currentUser?.id,
        request_type: requestType,
        context,
        context_data: contextData,
        subject,
        message,
        priority: requestType === "urgent_medical" ? "urgent" : "medium",
        auto_suggestions: suggestions
      });

      alert("Support request submitted successfully! We'll get back to you soon.");
      onClose();
      
      // Reset form
      setRequestType("");
      setSubject("");
      setMessage("");
      
    } catch (error) {
      console.error("Error submitting support request:", error);
      alert("Error submitting request. Please try again.");
    }
    setIsSubmitting(false);
  };

  const requestTypes = [
    { value: "exercise_help", label: "Exercise Help", icon: Play },
    { value: "pain_concern", label: "Pain Concern", icon: AlertTriangle },
    { value: "technical_issue", label: "Technical Issue", icon: MessageSquare },
    { value: "general_question", label: "General Question", icon: MessageSquare },
    { value: "urgent_medical", label: "Urgent Medical", icon: AlertTriangle }
  ];

  const handleSuggestionClick = (suggestion) => {
    if (suggestion.type === "faq") {
      // Show FAQ content
      alert(suggestion.content);
    } else if (suggestion.url) {
      // Open link
      window.open(suggestion.url, '_blank');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-sage-600" />
            Get Support & Assistance
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Quick Suggestions */}
          {showSuggestions && suggestions.length > 0 && (
            <Card className="border-sage-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Bot className="w-5 h-5 text-sage-600" />
                  Quick Help
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowSuggestions(false)}
                    className="ml-auto"
                  >
                    ×
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="p-3 bg-sage-50 rounded-lg cursor-pointer hover:bg-sage-100 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-sage-100 rounded-full flex items-center justify-center">
                        {suggestion.type === "faq" && <MessageSquare className="w-4 h-4 text-sage-600" />}
                        {suggestion.type === "video" && <Play className="w-4 h-4 text-sage-600" />}
                        {suggestion.type === "exercise" && <Play className="w-4 h-4 text-sage-600" />}
                      </div>
                      <div>
                        <h4 className="font-medium text-warm-gray-900">{suggestion.title}</h4>
                        <p className="text-sm text-warm-gray-600 mt-1">{suggestion.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Contact Form */}
          <Card className="border-sage-200">
            <CardHeader>
              <CardTitle className="text-lg">Contact Your Provider</CardTitle>
              <p className="text-warm-gray-600">
                Need personalized help? Send a message to your healthcare provider.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="request-type">Type of Request *</Label>
                <Select value={requestType} onValueChange={setRequestType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select request type" />
                  </SelectTrigger>
                  <SelectContent>
                    {requestTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <type.icon className="w-4 h-4" />
                          {type.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="subject">Subject *</Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Brief description of your request"
                />
              </div>

              <div>
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your question or concern in detail..."
                  rows={4}
                />
              </div>

              {/* Context Information */}
              {contextData && Object.keys(contextData).length > 0 && (
                <div className="p-3 bg-warm-gray-50 rounded-lg">
                  <p className="text-sm text-warm-gray-600 mb-2">
                    <strong>Context:</strong> This request is about:
                  </p>
                  {contextData.exercise_id && (
                    <Badge variant="outline">Exercise: {contextData.exercise_id}</Badge>
                  )}
                  {contextData.session_id && (
                    <Badge variant="outline">Session: {contextData.session_id}</Badge>
                  )}
                  <Badge variant="outline">Page: {context}</Badge>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleSubmitRequest}
                  disabled={isSubmitting}
                  className="bg-sage-600 hover:bg-sage-700 flex-1"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {isSubmitting ? "Sending..." : "Send Request"}
                </Button>
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <div>
                  <p className="font-medium text-red-800">Medical Emergency?</p>
                  <p className="text-sm text-red-700">
                    If you're experiencing a medical emergency, call emergency services immediately.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}