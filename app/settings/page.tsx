"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { User, Shield, Palette, Save } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-2">Settings</h1>
          <p className="text-slate-500">Manage your account preferences and application settings.</p>
        </div>

        <div className="space-y-6">
          {/* Profile Section */}
          <div className="group relative bg-white/70 backdrop-blur-md border border-white/50 rounded-2xl p-6 lg:p-8 shadow-lg shadow-slate-200/50 hover:shadow-xl transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent rounded-2xl" />
            <div className="relative">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Profile Information</h2>
                  <p className="text-sm text-slate-500">Update your personal details</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    defaultValue="John Doe"
                    className="w-full px-4 py-2.5 bg-white/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-900 placeholder:text-slate-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    defaultValue="john@company.com"
                    className="w-full px-4 py-2.5 bg-white/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-900 placeholder:text-slate-400"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Company Name</label>
                  <input
                    type="text"
                    defaultValue="Acme Corp"
                    className="w-full px-4 py-2.5 bg-white/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-900 placeholder:text-slate-400"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Security Section */}
          <div className="group relative bg-white/70 backdrop-blur-md border border-white/50 rounded-2xl p-6 lg:p-8 shadow-lg shadow-slate-200/50 hover:shadow-xl transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent rounded-2xl" />
            <div className="relative">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Security</h2>
                  <p className="text-sm text-slate-500">Manage your password and security settings</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-white/50 border border-slate-200 rounded-xl">
                <div>
                  <p className="font-semibold text-slate-900">Password</p>
                  <p className="text-sm text-slate-500">Last changed 30 days ago</p>
                </div>
                <Button variant="outline" className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 border-slate-200">
                  Change Password
                </Button>
              </div>
            </div>
          </div>

          {/* Appearance Section */}
          <div className="group relative bg-white/70 backdrop-blur-md border border-white/50 rounded-2xl p-6 lg:p-8 shadow-lg shadow-slate-200/50 hover:shadow-xl transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent rounded-2xl" />
            <div className="relative">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/30">
                  <Palette className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Appearance</h2>
                  <p className="text-sm text-slate-500">Customize your interface experience</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Theme Preference</label>
                <select className="w-full md:w-1/2 px-4 py-2.5 bg-white/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-900 cursor-pointer">
                  <option>Light Mode</option>
                  <option>Dark Mode</option>
                  <option>System Default</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 px-8 py-6 rounded-xl transition-all font-semibold text-base">
              <Save className="w-5 h-5 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
