<script setup lang="ts">
import type { SidebarProps } from '@/components/ui/sidebar'

import {
  SquareTerminal,
  User,
} from "lucide-vue-next"
import NavMain from '@/components/NavMain.vue'

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'

const props = withDefaults(defineProps<SidebarProps>(), {
  collapsible: "icon",
})

// This is sample data.
const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: SquareTerminal,
    },
    {
      title: "Users",
      url: "/users",
      icon: User,
    },
  ],
}
</script>

<template>
  <Sidebar v-bind="props">
    <SidebarHeader>
    </SidebarHeader>
    <SidebarContent>
      <NavMain :items="data.navMain" />
    </SidebarContent>
    <SidebarRail />
  </Sidebar>
</template>
