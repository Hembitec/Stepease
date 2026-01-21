"use client"

import Link from "next/link"
import { ArrowLeft, FileQuestion } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="text-center max-w-md">
                <div className="mb-8 flex justify-center">
                    <div className="p-4 bg-muted rounded-full">
                        <FileQuestion className="w-16 h-16 text-muted-foreground" />
                    </div>
                </div>

                <h1 className="text-6xl font-bold text-foreground mb-4">404</h1>
                <h2 className="text-2xl font-semibold text-foreground mb-2">Page Not Found</h2>
                <p className="text-muted-foreground mb-8">
                    The page you're looking for doesn't exist or has been moved.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link href="/">
                        <Button variant="default" className="gap-2">
                            <ArrowLeft className="w-4 h-4" />
                            Back to Home
                        </Button>
                    </Link>
                    <Link href="/dashboard">
                        <Button variant="outline">
                            Go to Dashboard
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
