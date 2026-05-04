<script setup lang="ts">
import type { SidebarProps } from '@/components/ui/sidebar'

import {
  SquareTerminal,
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
      title: "Playground",
      url: "/playground",
      icon: SquareTerminal,
      items: [
        {
          title: "History",
          url: "/",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    }
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
