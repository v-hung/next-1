import { SampleFieldAndDetailsType } from "./sample"
import AdminFormFieldText from "@/components/admin/form-field/AdminFormFieldText";
import AdminFormFieldRichText from "@/components/admin/form-field/AdminFormFieldRichText";
import AdminFormFieldNumber from "@/components/admin/form-field/AdminFormFieldNumber";
import AdminFormFieldBool from "@/components/admin/form-field/AdminFormFieldBool";
import AdminFormFieldDateTime from "@/components/admin/form-field/AdminFormFieldDateTime";
import AdminFormFieldImage from "@/components/admin/form-field/AdminFormFieldImage";
import AdminFormFieldSelect from "@/components/admin/form-field/AdminFormFieldSelect";
import AdminFormFieldRelation from "@/components/admin/form-field/AdminFormFieldRelation";
import AdminFormFieldPermissions from "@/components/admin/form-field/AdminFormFieldPermissions";

export type DataFieldType = Record<SampleFieldAndDetailsType['type'], {
  fieldName: string,
  icon: string,
  Component: React.FC<{
    label: string,
    name: string
    required?: boolean,
    defaultValue?: any,
    value?: string,
    onChange?: (data: any) => void
    className?: string,
    details: any
  }> | null
}>

export const DATA_FIELDS: DataFieldType = {
  'string': { fieldName: "Plain text", icon: 'title', Component: AdminFormFieldText },
  'text': { fieldName: "Rich text", icon: 'border_color', Component: AdminFormFieldRichText },
  'int': { fieldName: "Number", icon: 'tag', Component: AdminFormFieldNumber },
  'bool': { fieldName: "Boolean", icon: 'toggle_on', Component: AdminFormFieldBool },
  'date': { fieldName: "Date Time", icon: 'calendar_today', Component: AdminFormFieldDateTime },
  'image': { fieldName: "Image", icon: 'photo_library', Component: AdminFormFieldImage },
  'select': { fieldName: "Select", icon: 'checklist', Component: AdminFormFieldSelect },
  'relation': { fieldName: "Relation", icon: 'network_node', Component: AdminFormFieldRelation },
  'publish': { fieldName: "Publish", icon: 'publish', Component: null },
  'permissions': { fieldName: "Permission", icon: 'encrypted', Component: AdminFormFieldPermissions },
}