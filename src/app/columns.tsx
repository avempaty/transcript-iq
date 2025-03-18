import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { SummarizedContent } from "@/interfaces/transcription";
import { Button } from "@/components/ui/button";
export const columns: ColumnDef<SummarizedContent>[] = [
    {
        accessorKey: "patientId",
        header: "PatientID",
    },
    {
        accessorKey: "topics",
        header: "Topics",
        cell: ({ row }) => (
            <div className="flex flex-wrap gap-2">
                {row.original.topics.map((topic, index) => (
                    <Badge key={index} variant="secondary">
                        {topic}
                    </Badge>
                ))}
            </div>
        ),
    },
    {
        accessorKey: "conditions",
        header: "Conditions",
        cell: ({ row }) => (
            <div className="flex flex-wrap gap-2">
                {row.original.conditions.map((condition, index) => (
                    <Badge key={index} variant="secondary">
                        {condition}
                    </Badge>
                ))}
            </div>
        ),
    },
    {
        accessorKey: "followUpNeeded",
        header: "Follow Up Needed",
        cell: ({ row }) => (
            <div className="flex items-center">
                {row.original.followUpNeeded.length > 0 ? (
                    <div>
                        <Button>Yes</Button>
                    </div>
                ) : (
                    <div>
                        <Button>No</Button>
                    </div>
                )}
            </div>
        ),
    },
    {
        accessorKey: "humanReviewNeeded",
        header: "Human Review Needed",
    },
    {
        accessorKey: "priority",
        header: "Priority",
    },
];
