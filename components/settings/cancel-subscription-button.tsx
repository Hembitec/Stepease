"use client"

import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { cancelSubscriptionAction } from "@/app/actions/payment"

export function CancelSubscriptionButton() {
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)
    const { user } = useUser()

    const handleCancel = async () => {
        setLoading(true)
        try {
            const email = user?.emailAddresses[0]?.emailAddress || ""
            const result = await cancelSubscriptionAction(email)
            if (result.success) {
                toast.success(result.message)
                setOpen(false)
                window.location.reload()
            } else {
                toast.error(result.message)
            }
        } catch (error) {
            toast.error("An unexpected error occurred.")
        } finally {
            setLoading(false)
        }
    }

    if (!open) {
        return (
            <Button
                variant="outline"
                className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                onClick={() => setOpen(true)}
            >
                Cancel Subscription
            </Button>
        )
    }

    return (
        <div className="flex flex-wrap items-center gap-2 animate-in fade-in slide-in-from-right-4 duration-200">
            <span className="text-sm text-slate-600 mr-2">Are you sure?</span>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => setOpen(false)}
                disabled={loading}
            >
                Keep it
            </Button>
            <Button
                variant="destructive"
                size="sm"
                onClick={handleCancel}
                disabled={loading}
            >
                {loading ? "Cancelling..." : "Yes, Cancel"}
            </Button>
        </div>
    )
}
