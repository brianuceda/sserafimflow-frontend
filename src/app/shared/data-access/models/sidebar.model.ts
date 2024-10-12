export interface SidebarItem {
  id?: string;
  icon?: string;
  title: string;
  route?: string;
  childrens?: SidebarItem[];
}