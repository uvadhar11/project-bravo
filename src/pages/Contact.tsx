import { useRef, useState } from "react";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Mail, Phone, MapPin } from "lucide-react";
import { toast } from "sonner";
import emailjs from "@emailjs/browser";

export function Contact() {
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
        toast.error("Missing email.js envs");
      } else {
        // everything is good so send the email
        await emailjs.sendForm(
          SERVICE_ID,
          TEMPLATE_ID,
          formRef.current!,
          PUBLIC_KEY
        );
        toast.success(
          "Message sent successfully! The team will contact you soon."
        );
      }

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (error: any) {
      console.error("Email Error:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center space-y-4">
        <h1 className="text-slate-900 text-3xl font-bold">Contact Us</h1>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="p-6 space-y-3 text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
            <Mail className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-slate-900">Email</h3>
          <p className="text-slate-600">bravotracker2@gmail.com</p>
        </Card>

        <Card className="p-6 space-y-3 text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <Phone className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-slate-900">Phone</h3>
          <p className="text-slate-600">+1 (279) 977-8354</p>
        </Card>

        <Card className="p-6 space-y-3 text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
            <MapPin className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="text-slate-900">Location</h3>
          <p className="text-slate-600">Sacramento, CA</p>
        </Card>
      </div>

      <Card className="p-8">
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message *</Label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Your message here..."
              rows={6}
              required
            />
          </div>

          <Button type="submit" className="w-full">
            Send Message
          </Button>
        </form>
      </Card>
    </div>
  );
}
