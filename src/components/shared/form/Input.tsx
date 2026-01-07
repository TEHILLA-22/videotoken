import React from "react";
import {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormDescription,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Control } from "react-hook-form";

type FieldType = "input" | "textarea";

interface ReusableFormFieldProps {
    control: Control<any>;
    name: string;
    type?: "text" | "file" | "number" | "radio" | "url"
    label?: string;
    description?: string;
    placeholder?: string;
    fieldType?: FieldType;
    className?: string;
    labelStyle?: string;
}

export function ReusableFormField({
    control,
    name,
    label,
    type,
    description,
    placeholder,
    fieldType = "input",
    className="w-full urbanist text-white/50",
    labelStyle = "text-white urbanist"
}: ReusableFormFieldProps) {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    {label && <FormLabel className={labelStyle}>{label}</FormLabel>}
                    <FormControl>
                        {fieldType === "textarea" ? (
                            <Textarea
                                {...field}
                                placeholder={placeholder}
                                className={className}
                            />
                        ) : (
                            <Input
                                {...field}
                                placeholder={placeholder}
                                type={type}
                                className={className}
                            />
                        )}
                    </FormControl>
                    {description && <FormDescription>{description}</FormDescription>}
                    <FormMessage className="text-red-600 text-sm font-light" />
                </FormItem>
            )}
        />
    );
}
