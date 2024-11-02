import { zodResolver } from "@hookform/resolvers/zod"
import React from "react"
import { useForm } from "react-hook-form"
import { useParams } from "react-router-dom"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./components/ui/form"
import { Input } from "./components/ui/input"
import { FormSchema } from "./hooks/form-schema"
import { useSavedForms } from "./hooks/use-saved-forms"
import { Button } from "./components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "./components/ui/popover"
import { cn } from "./lib/utils"
import { CalendarIcon, X } from "lucide-react"
import { Calendar } from "./components/ui/calendar"
import { PageLayout } from "./components/page-layout"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select"


const getFieldSchema = (type: FormSchema["formFields"][number]["type"]) => {
    switch (type) {
      case "string":
        return z.string().optional()
      case "number":
        return z.number().optional()
      case "date":
        return z.date().optional()
      default:
        return z.string().optional()
    }
  }

const registryOptions: Array<{ label: string, value: string }> = [
    {
    label: "CClear",
    value: "cclear"
    }
]

export default function DynamicForm() {

    const { uuid } = useParams<{ uuid: string }>()

    const [savedForms] = useSavedForms();

    const currentForm = React.useMemo(() => savedForms.find((form) => form.uuid === uuid), [uuid, savedForms])

    const [selectedRegistry, setSelectedRegistry] = React.useState<string | undefined>()

    // Generate Zod schema dynamically
    const formSchema = currentForm ? z.object(
      Object.fromEntries(
        currentForm?.formFields.map((field) => [field.title, getFieldSchema(field.type)])
      )
    ) : z.object({})

    console.log(formSchema)
  
    // Create form
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
    })
  
    // Handle form submission
    function onSubmit(values: z.infer<typeof formSchema>) {
      console.log(values)
    }

    if (!currentForm) {
        return <div>Form not found</div>
    }
  
    return (
      <PageLayout>
        <h2 className="text-2xl font-bold mb-4">{currentForm.formTitle}</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {currentForm.formFields.map((field, index) => (
              <FormField
                // @ts-expect-error never type
                name={field.title}
                key={index}
                control={form.control}
                render={({ field: formField }) => (
                    <FormItem>
                        <FormLabel>{field.title}</FormLabel>
                        <FormControl>
                        {field.type === "date" ? (
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !formField.value && "text-muted-foreground"
                              )}
                            >
                              {formField.value ? (formField.value as Date).toString() : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={formField.value}
                            onSelect={formField.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    ) : (
                      <Input
                        type={field.type === "number" ? "number" : "text"}
                        {...formField}
                      />
                    )}
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            ))}
            <div className="flex space-x-1">
            <Select onValueChange={setSelectedRegistry} value={selectedRegistry ?? ''}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Zvolte registr" />
              </SelectTrigger>
              <SelectContent>
                {registryOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button disabled={!selectedRegistry} onClick={() => setSelectedRegistry(undefined)}><X /></Button>
            <Button type="submit" disabled={!selectedRegistry}>Nahrát do registru</Button>
          </div>
          </form>
        </Form>
      </PageLayout>
    )
  }