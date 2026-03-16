"use client"

import { useState, useEffect } from "react"
import { Lock, Crown } from "lucide-react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface WatermarkSettingsProps {
    tier: "free" | "starter" | "pro"
}

export function WatermarkSettings({ tier }: WatermarkSettingsProps) {
    const watermarkData = useQuery(api.users.getWatermarkSettings)
    const updateWatermark = useMutation(api.users.updateWatermarkSettings)
    const [text, setText] = useState("")
    const [enabled, setEnabled] = useState(false)
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)

    // Sync state when data loads
    useEffect(() => {
        if (watermarkData) {
            setText(watermarkData.customWatermark)
            setEnabled(watermarkData.watermarkEnabled)
        }
    }, [watermarkData])

    const handleSave = async () => {
        setSaving(true)
        try {
            await updateWatermark({ customWatermark: text, watermarkEnabled: enabled })
            toast.success("Watermark settings saved")
            setSaved(true)
        } catch (error) {
            toast.error("Failed to save watermark settings")
        } finally {
            setSaving(false)
        }
    }

    if (tier !== "pro") {
        return (
            <div className="bg-white rounded-xl border border-slate-200 p-6">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center">
                        <Lock className="w-4 h-4 text-slate-400" />
                    </div>
                    <div>
                        <h3 className="font-medium text-slate-900">Custom PDF Watermark</h3>
                        <p className="text-xs text-slate-500">Brand your exported PDFs with your company name</p>
                    </div>
                </div>
                <div className="bg-amber-50 border border-amber-100 rounded-lg px-4 py-3 flex items-center gap-2">
                    <Crown className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <p className="text-sm text-amber-700">
                        Upgrade to <span className="font-semibold">Pro</span> to add custom watermarks to your PDF exports.
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="font-medium text-slate-900">Custom PDF Watermark</h3>
                    <p className="text-sm text-slate-500 mt-0.5">Brand your exported PDFs with a subtle tiled watermark</p>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-700 uppercase tracking-wide">
                    Pro
                </span>
            </div>

            <div className="space-y-4">
                {/* Watermark Text */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Watermark Text
                    </label>
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => { setText(e.target.value); setSaved(false) }}
                        placeholder="e.g. Acme Corporation"
                        maxLength={30}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-400"
                    />
                    <p className="text-xs text-slate-400 mt-1">
                        This text will appear as a subtle diagonal pattern on your PDF exports.
                    </p>
                </div>

                {/* Toggle */}
                <div className="flex items-center justify-between">
                    <label className="text-sm text-slate-700">Enable watermark on PDF exports</label>
                    <button
                        onClick={() => { setEnabled(!enabled); setSaved(false) }}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${enabled ? "bg-blue-600" : "bg-slate-200"
                            }`}
                    >
                        <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${enabled ? "translate-x-6" : "translate-x-1"
                                }`}
                        />
                    </button>
                </div>

                {/* Save */}
                <Button
                    onClick={handleSave}
                    disabled={saving || saved}
                    className={saved
                        ? "bg-green-600 hover:bg-green-600 text-white text-sm cursor-default"
                        : "bg-blue-600 hover:bg-blue-700 text-white text-sm"
                    }
                >
                    {saving ? "Saving..." : saved ? "✓ Saved" : "Save Changes"}
                </Button>
            </div>
        </div>
    )
}
