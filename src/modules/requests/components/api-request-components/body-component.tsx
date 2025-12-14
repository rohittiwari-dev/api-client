import { FileJson, FileText, FormInput, Braces } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BodyType } from "@/generated/prisma/browser";
import { cn } from "@/lib/utils";
import FormDataComponent from "./formdata-component";
import JsonAndRawBodyComponent from "./json-raw-body-component";
import useRequestSyncStoreState from "../../hooks/requestSyncStore";

const bodyTypes = [
  { value: BodyType.NONE, label: "None", icon: null },
  { value: BodyType.JSON, label: "JSON", icon: Braces },
  { value: BodyType.FORM_DATA, label: "Form Data", icon: FormInput },
  {
    value: BodyType.X_WWW_FORM_URLENCODED,
    label: "URL Encoded",
    icon: FormInput,
  },
  { value: BodyType.RAW, label: "Raw", icon: FileText },
];

const BodyComponent = () => {
  const { activeRequest, updateRequest } = useRequestSyncStoreState();

  return (
    <Tabs
      value={activeRequest?.bodyType || BodyType.NONE}
      onValueChange={(val) => {
        updateRequest(activeRequest?.id || "", {
          bodyType: val as BodyType,
          unsaved: true,
        });
      }}
      className="flex flex-1 min-h-0 flex-col w-full overflow-hidden"
    >
      {/* Modern Tab List */}
      <div className="flex items-center py-2 sticky top-0 z-10">
        <TabsList className="h-8 gap-0.5 p-1 rounded-lg bg-muted/50">
          {bodyTypes.map((type) => {
            const Icon = type.icon;
            return (
              <TabsTrigger
                key={type.value}
                value={type.value}
                className={cn(
                  "h-6 px-3 rounded-md text-[11px] font-medium cursor-pointer gap-1.5",
                  "transition-all duration-200",
                  "data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-foreground",
                  "data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-foreground"
                )}
              >
                {Icon && <Icon className="size-3" />}
                {type.label}
              </TabsTrigger>
            );
          })}
        </TabsList>
      </div>

      {/* Content Area */}
      <div className="flex-1 min-h-0 overflow-auto">
        {/* None - Empty State */}
        <TabsContent
          value={BodyType.NONE}
          className="h-full mt-0 data-[state=active]:flex flex-col"
        >
          <div className="flex-1 flex flex-col items-center justify-center gap-4 py-16">
            <div className="size-14 rounded-2xl bg-gradient-to-br from-muted/50 to-muted/30 border border-dashed border-border/50 flex items-center justify-center">
              <FileJson className="size-6 text-muted-foreground/40" />
            </div>
            <div className="text-center space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                No Body
              </p>
              <p className="text-xs text-muted-foreground/70 max-w-[220px]">
                Select a body type above to add content to your request
              </p>
            </div>
          </div>
        </TabsContent>

        {/* JSON Body */}
        <TabsContent
          value={BodyType.JSON}
          className="h-full min-h-0 mt-0 data-[state=active]:flex flex-col overflow-auto"
        >
          <JsonAndRawBodyComponent
            type="json"
            value={activeRequest?.body?.json || ""}
            onChange={(value) => {
              updateRequest(activeRequest?.id || "", {
                body: {
                  ...(activeRequest?.body || {
                    raw: "",
                    formData: [],
                    urlEncoded: [],
                    file: null,
                    json: {},
                  }),
                  json: value as Record<string, any>,
                },
                unsaved: true,
              });
            }}
          />
        </TabsContent>

        {/* Form Data */}
        <TabsContent
          value={BodyType.FORM_DATA}
          className="h-full mt-0 data-[state=active]:flex flex-col"
        >
          <FormDataComponent type="FORM_DATA" />
        </TabsContent>

        {/* URL Encoded */}
        <TabsContent
          value={BodyType.X_WWW_FORM_URLENCODED}
          className="h-full mt-0 data-[state=active]:flex flex-col"
        >
          <FormDataComponent type="X-WWW-FORM-URLENCODED" />
        </TabsContent>

        {/* Raw Body */}
        <TabsContent
          value={BodyType.RAW}
          className="h-full min-h-0 mt-0 data-[state=active]:flex flex-col overflow-auto"
        >
          <JsonAndRawBodyComponent
            type="raw"
            value={activeRequest?.body?.raw || ""}
            onChange={(value) => {
              updateRequest(activeRequest?.id || "", {
                body: {
                  ...(activeRequest?.body || {
                    raw: "",
                    formData: [],
                    urlEncoded: [],
                    file: null,
                    json: {},
                  }),
                  raw: value?.toString() || "",
                },
                unsaved: true,
              });
            }}
          />
        </TabsContent>
      </div>
    </Tabs>
  );
};

export default BodyComponent;
