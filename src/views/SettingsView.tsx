"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/shared/ui/shad-cn/input";
import { Card } from "@/shared/ui/shad-cn/card";
import { useTheme } from "next-themes";
import { useAuth } from "@/features/auth";
import { OrganizationSettingsBlock } from "@/features/organization/components/OrganizationSettingsBlock";
import { SelectField } from "@/shared/ui/SelectField";

export function SettingsView() {
  const { theme, setTheme } = useTheme();
  const { appRole } = useAuth();

  const [settings, setSettings] = useState({
    language: "English",
    twoFactor: true,
    pushNotifications: true,
    desktopNotifications: true,
    emailNotifications: true,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const renderToggle = (title: string, description: string, key: keyof typeof settings) => {
    const isChecked = settings[key] as boolean;
    return (
      <div className="flex items-center justify-between py-6 border-b border-border/50 last:border-0">
        <div>
          <h4 className="text-foreground font-medium text-sm">{title}</h4>
          <p className="text-muted-foreground text-sm mt-1">{description}</p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={isChecked}
          onClick={() => toggleSetting(key)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
            isChecked ? "bg-green-500" : "bg-muted"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              isChecked ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-8 h-full pb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">All System Settings</p>
        </div>

        <div className="relative w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search"
            className="pl-9 bg-card border-border h-10"
          />
        </div>
      </div>

      {appRole === "ORGANIZATION_ADMIN" && <OrganizationSettingsBlock />}

      <Card className="bg-card border-border p-6 overflow-hidden">
        <div className="flex items-center justify-between py-6 border-b border-border/50">
          <div>
            <h4 className="text-foreground font-medium text-sm">Appearance</h4>
            <p className="text-muted-foreground text-sm mt-1">Customize how your theme looks on your device</p>
          </div>
          <div className="w-32">
            <SelectField
              label=""
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              options={[
                { label: "Light", value: "light" },
                { label: "Dark", value: "dark" },
                { label: "System", value: "system" },
              ]}
            />
          </div>
        </div>

        <div className="flex items-center justify-between py-6 border-b border-border/50">
          <div>
            <h4 className="text-foreground font-medium text-sm">Language</h4>
            <p className="text-muted-foreground text-sm mt-1">Select your language</p>
          </div>
          <div className="w-32">
            <SelectField
              label=""
              value={settings.language}
              onChange={(e) => setSettings({ ...settings, language: e.target.value })}
              options={[
                { label: "English", value: "English" },
                { label: "Spanish", value: "Spanish" },
              ]}
            />
          </div>
        </div>

        {renderToggle(
          "Two-factor Authentication",
          "Keep your account secure by enabling 2FA via mail",
          "twoFactor"
        )}
        
        {renderToggle(
          "Mobile Push Notifications",
          "Receive push notification",
          "pushNotifications"
        )}

        {renderToggle(
          "Desktop Notification",
          "Receive push notification in desktop",
          "desktopNotifications"
        )}

        {renderToggle(
          "Email Notifications",
          "Receive email notification",
          "emailNotifications"
        )}
      </Card>
    </div>
  );
}

export default SettingsView;
