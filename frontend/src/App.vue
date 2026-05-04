<script setup lang="ts">
import AppSidebar from "@/components/AppSidebar.vue";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useBreadcrumb } from "@/composables/useBreadcrumb";
import { Toaster } from "@/components/ui/sonner";
import 'vue-sonner/style.css';

import { useRoute } from 'vue-router'

const { items: breadcrumbItems } = useBreadcrumb();
const route = useRoute()
</script>

<template>
  <Toaster />

  <RouterView v-slot="{ Component }">
    <SidebarProvider :key="'app-layout'">
      <AppSidebar />
      <SidebarInset>
        <header class="flex h-12 shrink-0 items-center gap-2">
          <div class="flex items-center gap-2 px-4">
            <SidebarTrigger class="-ml-1" />
            <Separator orientation="vertical" class="mr-2 data-[orientation=vertical]:h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <template v-for="(item, index) in breadcrumbItems" :key="item.title">
                  <BreadcrumbItem>
                    <BreadcrumbPage v-if="index === breadcrumbItems.length - 1">
                      {{ item.title }}
                    </BreadcrumbPage>
                    <BreadcrumbLink v-else :href="item.href ?? '#'">
                      {{ item.title }}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator v-if="index < breadcrumbItems.length - 1" />
                </template>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <hr class="border-border" />
        <component :is="Component" v-if="Component" :key="route.fullPath" />
      </SidebarInset>
    </SidebarProvider>
  </RouterView>
</template>
