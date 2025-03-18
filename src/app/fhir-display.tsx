import { Card } from "@/components/ui/card";
import { FhirResources } from "@/interfaces/transcription";
import React from "react";

interface FhirDataProps {
    data: FhirResources;
}

export const FhirDataDisplay: React.FC<FhirDataProps> = ({ data }) => {
    return (
        <div className="flex flex-wrap gap-3 items-start">
            {Array.isArray(data?.resourceType) && data.resourceType.map((item, index) => (
                <Card key={index} className="p-4 shadow-lg max-w-[300px] max-h-[400px] overflow-auto">
                    <h2 className="font-bold text-lg mb-2">{item.type || "No Type Available"}</h2>
                    
                    {/* Loop through keys to display all values */}
                    {Object.entries(item.data).map(([key, value]) => (
                        <div key={key} className="mt-2">
                            <p className="font-bold text-sm">{key}:</p>

                            {/* Handle objects properly */}
                            {typeof value === "object" && value !== null ? (
                                Array.isArray(value) ? (
                                    <ul className="list-disc pl-5 text-xs">
                                        {value.map((val, i) => (
                                            <li key={i} className="break-words">{JSON.stringify(val)}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <pre className="text-xs whitespace-pre-wrap break-words">{JSON.stringify(value, null, 2)}</pre>
                                )
                            ) : (
                                <p className="break-words text-xs">{value}</p>
                            )}
                        </div>
                    ))}
                </Card>
            ))}
        </div>
    );
};

