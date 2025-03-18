import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import React from "react";
import { FhirResources } from "@/interfaces/transcription";

// Define the types of the JSON data structure
interface Category {
    coding: {
        code: string;
        system: string;
        display: string;
    }[];
}

interface Code {
    text: string;
    coding: {
        code: string;
        system: string;
        display: string;
    }[];
}

interface Subject {
    reference: string;
}

interface EntryData {
    code: Code;
    status: string;
    subject: Subject;
    category?: Category[];
    type: string;
}

interface FhirDataProps {
    data: FhirResources; // Array of stringified JSON objects
}

export const FhirDataDisplay: React.FC<FhirDataProps> = ({ data }) => {
    const [fhirResources, setFhirResources] = React.useState<EntryData[]>([]);

    React.useEffect(() => {
        async function getFhirResources() {
            try {
                console.log(data);

                // Parse the stringified JSON objects and extract the data
                const parsedData: EntryData[] = data.resourceType.map(
                    /* eslint-disable @typescript-eslint/no-explicit-any */
                    (item: any) => {
                        return {
                            code: item.data.code || {
                                text: "No code available",
                                coding: [],
                            },
                            status: item.data.status || "No status available",
                            subject: item.subject || {
                                reference: "No subject available",
                            },
                            category: item.data.subject || [],
                            type: item.type || "No type available",
                        };
                    }
                );

                // Update the state with parsed data
                setFhirResources(parsedData);
                console.log(parsedData); // Optionally log the parsed data
            } catch (err) {
                console.log("Error fetching or parsing data:", err);
            }
        }
        if (data) {
            getFhirResources();
        }
    }, [data]); // Empty dependency array to run only once when the component mounts

    return (
        <div className="flex flex-wrap gap-4 items-start">
            {fhirResources.map((entry, index) => {
                const { code, status, subject, category, type } = entry;
                return (
                    <Card key={index} className="p-4 shadow-lg">
                        <h2 className="font-bold text-lg mb-2">Type: {type}</h2>
                        <Label className="text-sm font-medium">Code:</Label>
                        <text className="font-bold">{code?.text || "No code available"}</text>
                        <Label className="text-sm font-medium mt-2">
                            Status:
                        </Label>
                        <text className="font-bold">{status || "No status available"}</text>
                        <Label className="text-sm font-medium mt-2">
                            Subject:
                        </Label>
                        <text className="font-bold">{subject?.reference || "No subject available"}</text>
                        {category && category.length > 0 && (
                            <div className="mt-2">
                                <Label className="text-sm font-medium">
                                    Category:
                                </Label>
                                <div className="grid grid-cols-2 gap-2">
                                    {category.map((cat, idx) => (
                                        <p key={idx}>
                                            {cat?.coding[0]?.display ||
                                                "No category display"}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        )}
                    </Card>
                );
            })}
        </div>
    );
};
