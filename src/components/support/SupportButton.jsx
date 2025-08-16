import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { HelpCircle, MessageSquare, Phone, Video, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import SupportModal from "./SupportModal";

export default function SupportButton({ 
  variant = "default", 
  context = "dashboard", 
  contextData = {},
  className = "",
  children 
}) {
  const [showSupportModal, setShowSupportModal] = useState(false);

  const variants = {
    default: {
      icon: HelpCircle,
      label: "Need Help?",
      className: "bg-sage-600 hover:bg-sage-700 text-white"
    },
    floating: {
      icon: MessageSquare,
      label: "Get Support",
      className: "fixed bottom-6 right-6 z-50 rounded-full w-14 h-14 shadow-lg bg-sage-600 hover:bg-sage-700 text-white"
    },
    inline: {
      icon: HelpCircle,
      label: "Help",
      className: "bg-transparent hover:bg-sage-50 text-sage-600 border border-sage-300"
    },
    urgent: {
      icon: Zap,
      label: "Urgent Help",
      className: "bg-red-600 hover:bg-red-700 text-white animate-pulse"
    }
  };

  const config = variants[variant] || variants.default;
  const Icon = config.icon;

  return (
    <>
      <Button
        onClick={() => setShowSupportModal(true)}
        className={cn(config.className, className)}
        size={variant === "floating" ? "icon" : "default"}
        aria-label="Get support and assistance"
      >
        <Icon className={variant === "floating" ? "w-6 h-6" : "w-4 h-4 mr-2"} />
        {variant !== "floating" && (children || config.label)}
      </Button>

      <SupportModal
        isOpen={showSupportModal}
        onClose={() => setShowSupportModal(false)}
        context={context}
        contextData={contextData}
      />
    </>
  );
}