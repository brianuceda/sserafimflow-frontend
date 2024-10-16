export interface SidebarItem {
  icon?: string;
  title: string;
  route?: string;
  childrens?: SidebarItem[];
}