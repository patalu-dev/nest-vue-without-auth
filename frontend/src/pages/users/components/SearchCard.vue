<script setup lang="ts">
import { ref, watch } from 'vue'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { X, Search, CalendarIcon } from 'lucide-vue-next'
import {
    Card,
    CardContent,
} from '@/components/ui/card'
import {
    DateFormatter,
    getLocalTimeZone,
} from '@internationalized/date';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

const df = new DateFormatter('vi-VN', {
    dateStyle: 'long',
});

const props = defineProps({
    initialFilters: {
        type: Object,
        default: () => ({
            name: '',
            username: '',
            email: '',
            fromDate: null,
            toDate: null
        })
    },
    loading: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['search'])

// State
const filters = ref({ ...props.initialFilters })

// Watch for prop changes to sync internal state
watch(() => props.initialFilters, (newVal: any) => {
    filters.value = { ...newVal }
}, { deep: true })

const handleSearch = () => {
    emit('search', { ...filters.value })
}

const handleClear = () => {
    filters.value.name = ''
    filters.value.username = ''
    filters.value.email = ''
    filters.value.fromDate = null
    filters.value.toDate = null
    handleSearch()
}
</script>

<template>
    <Card>
        <CardContent>
            <div class="grid grid-cols-2 md:grid-cols-6 gap-3">
                <div class="flex flex-col gap-2">
                    <Label for="name">Họ tên</Label>
                    <Input id="name" type="text" v-model="filters.name" placeholder="Họ tên" />
                </div>
                <div class="flex flex-col gap-2">
                    <Label for="username">Tài khoản</Label>
                    <Input id="username" type="text" v-model="filters.username" placeholder="Nhập tài khoản" />
                </div>
                <div class="flex flex-col gap-2">
                    <Label for="email">Email</Label>
                    <Input id="email" type="text" v-model="filters.email" placeholder="Nhập email" />
                </div>
                <div class="flex flex-col gap-2">
                    <Label for="fromDate">Từ ngày</Label>
                    <Popover>
                        <PopoverTrigger as-child>
                            <Button variant="outline" :class="cn(
                                'justify-start text-left font-normal',
                                !filters.fromDate && 'text-muted-foreground',
                            )
                                ">
                                <CalendarIcon class="mr-2 h-4 w-4" />
                                {{
                                    filters.fromDate
                                        ? df.format(
                                            filters.fromDate.toDate(getLocalTimeZone()),
                                        )
                                        : 'Chọn ngày'
                                }}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent class="w-auto p-0">
                            <Calendar v-model="filters.fromDate" initial-focus />
                        </PopoverContent>
                    </Popover>
                </div>
                <div class="flex flex-col gap-2">
                    <Label for="toDate">Đến ngày</Label>
                    <Popover>
                        <PopoverTrigger as-child>
                            <Button variant="outline" :class="cn(
                                'justify-start text-left font-normal',
                                !filters.toDate && 'text-muted-foreground',
                            )
                                ">
                                <CalendarIcon class="mr-2 h-4 w-4" />
                                {{
                                    filters.toDate
                                        ? df.format(
                                            filters.toDate.toDate(
                                                getLocalTimeZone(),
                                            ),
                                        )
                                        : 'Chọn ngày'
                                }}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent class="w-auto p-0">
                            <Calendar v-model="filters.toDate" initial-focus />
                        </PopoverContent>
                    </Popover>
                </div>
                <div class="flex gap-2 items-end">
                    <Button variant="outline" @click="handleSearch" :disabled="loading">
                        <Search class="h-4 w-4 mr-2" /> Tìm kiếm
                    </Button>
                    <Button variant="secondary" size="icon" @click="handleClear" :disabled="loading">
                        <X class="h-4 w-4" aria-label="Xóa bộ lọc" />
                    </Button>
                </div>
            </div>
        </CardContent>
    </Card>
</template>

<style scoped>
/* Custom styles if needed */
</style>