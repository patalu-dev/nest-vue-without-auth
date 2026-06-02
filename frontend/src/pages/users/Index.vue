<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { parseDate } from '@internationalized/date';
import type { DateValue } from '@internationalized/date';
import { Button } from '@/components/ui/button';
import { request } from '@/lib/api'
import { useRouter, useRoute } from 'vue-router';
import { exportUsers } from './lib/exportExcel.ts';
import { ChevronLeft, ChevronRight, FileSpreadsheet, Inbox, User } from 'lucide-vue-next';
import { formatDate } from '@/lib/utils'
import { useBreadcrumb } from '@/composables/useBreadcrumb'
import { Spinner } from '@/components/ui/spinner'
import SearchCard from './components/SearchCard.vue';

const router = useRouter()
const route = useRoute()
const { setBreadcrumbs } = useBreadcrumb()
// Breadcrumbs setup
setBreadcrumbs([
    { title: 'Danh sách người dùng' }
])

const loading = ref(false)
const items = ref<any[]>([])
const filters = ref<{
    name: string
    username: string
    email: string
    fromDate: DateValue | null
    toDate: DateValue | null
}>({
    name: '',
    username: '',
    email: '',
    fromDate: null,
    toDate: null
})

const pagination = ref({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
})

// Logic hiển thị tối đa 6 trang với dấu ba chấm
const displayedPages = computed(() => {
    const total = pagination.value.totalPages
    const current = pagination.value.page
    const pages: (number | string)[] = []

    if (total <= 6) {
        for (let i = 1; i <= total; i++) pages.push(i)
        return pages
    }

    if (current <= 3) {
        pages.push(1, 2, 3, 4, '...', total)
    } else if (current >= total - 2) {
        pages.push(1, '...', total - 3, total - 2, total - 1, total)
    } else {
        pages.push(1, '...', current - 1, current, current + 1, '...', total)
    }
    return pages
})

const fetchItems = async () => {
    loading.value = true
    try {
        const queryParams = new URLSearchParams()

        if (filters.value.name) queryParams.append('name', filters.value.name)
        if (filters.value.username) queryParams.append('username', filters.value.username)
        if (filters.value.email) queryParams.append('email', filters.value.email)
        // Gọi .toString() để chuyển DateValue → 'YYYY-MM-DD'
        if (filters.value.fromDate) queryParams.append('fromDate', filters.value.fromDate.toString())
        if (filters.value.toDate) queryParams.append('toDate', filters.value.toDate.toString())

        queryParams.append('page', pagination.value.page.toString())
        queryParams.append('limit', pagination.value.limit.toString())

        const result = await request(`/users?${queryParams.toString()}`)

        items.value = result.items || []
        pagination.value.total = result.total || 0
        pagination.value.totalPages = result.totalPages || 0
    } catch (err: any) {
        console.error(err)
    } finally {
        loading.value = false
    }
}

const handleSearch = (newFilters: any) => {
    filters.value = newFilters
    pagination.value.page = 1

    // Chỉ cập nhật URL – watcher sẽ tự gọi fetchItems()
    router.replace({
        query: {
            ...route.query,
            name: filters.value.name || undefined,
            username: filters.value.username || undefined,
            email: filters.value.email || undefined,
            // Chuyển DateValue → string 'YYYY-MM-DD' trước khi đưa vào URL
            fromDate: filters.value.fromDate?.toString() || undefined,
            toDate: filters.value.toDate?.toString() || undefined,
            page: '1',
        }
    }).catch((err) => {
        // NavigationDuplicated hoặc lỗi khác – fetch trực tiếp khi URL không thay đổi
        if (err?.name !== 'NavigationDuplicated') {
            console.error('Router error:', err)
        }
        fetchItems()
    })
}

const handleExport = async () => {
    await exportUsers(filters.value)
}

const handlePageChange = (newPage: number) => {
    // Chỉ cập nhật URL – watcher sẽ tự gọi fetchItems()
    router.replace({ query: { ...route.query, page: newPage.toString() } }).catch((err) => {
        if (err?.name !== 'NavigationDuplicated') {
            console.error('Router error:', err)
        }
        fetchItems()
    })
}

const syncFiltersFromUrl = () => {
    filters.value.name = (route.query.name as string) || ''
    filters.value.username = (route.query.username as string) || ''
    filters.value.email = (route.query.email as string) || ''
    // Parse chuỗi 'YYYY-MM-DD' từ URL về DateValue để Calendar hiển thị đúng
    const fromDateStr = route.query.fromDate as string
    const toDateStr = route.query.toDate as string
    filters.value.fromDate = fromDateStr ? parseDate(fromDateStr) : null
    filters.value.toDate = toDateStr ? parseDate(toDateStr) : null
}

watch(() => route.query, () => {
    syncFiltersFromUrl()
    fetchItems()
}, { deep: true })

// Load data on mount
onMounted(() => {
    syncFiltersFromUrl()
    const pageParam = route.query.page ? parseInt(route.query.page as string) : 1
    pagination.value.page = pageParam
    fetchItems()
})
</script>

<template>
    <div class="flex flex-1 flex-col gap-4 p-4 pt-4">
        <!-- Header Section -->
        <div class="relative overflow-hidden rounded bg-white px-6 py-2 shadow-sm border border-gray-100">
            <div class="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div class="flex items-center gap-4">
                    <User class="h-10 w-10 text-blue-500" />
                    <div>
                        <h1 class="text-xl font-bold tracking-tight text-gray-900">Danh sách người dùng</h1>
                        <p class="text-sm text-gray-500">Hệ thống theo dõi và quản lý danh sách người dùng</p>
                    </div>
                </div>
            </div>
        </div>
        <SearchCard :initial-filters="filters" :loading="loading" @search="handleSearch" />
        <div class="overflow-x-auto border border-gray-200 rounded shadow-sm bg-white">
            <div class="w-full overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200 text-sm text-left">
                    <thead class="text-gray-700 h-8">
                        <tr>
                            <th class="px-4 py-1 border-b whitespace-nowrap w-12 text-center">STT</th>
                            <th class="px-4 py-1 border-b whitespace-nowrap">Họ tên</th>
                            <th class="px-4 py-1 border-b whitespace-nowrap">Tài khoản</th>
                            <th class="px-4 py-1 border-b whitespace-nowrap">Email</th>
                            <th class="px-4 py-1 border-b whitespace-nowrap">Ngày tạo</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                        <tr v-if="loading">
                            <td colspan="6" class="px-4 py-10 text-center">
                                <div class="flex flex-col items-center justify-center gap-3">
                                    <Spinner class="w-6 h-6 text-gray-400" />
                                    <span class="text-sm text-gray-400">Đang tải dữ liệu...</span>
                                </div>
                            </td>
                        </tr>
                        <tr v-else-if="!loading && items.length === 0">
                            <td colspan="6" class="px-4 py-12 text-center text-gray-500">
                                <div class="flex flex-col items-center justify-center">
                                    <Inbox class="w-12 h-12 text-gray-300 mb-4" />
                                    <p class="text-base text-gray-400">Không có dữ liệu để hiển thị</p>
                                </div>
                            </td>
                        </tr>
                        <tr v-else class="hover:bg-gray-50 transition-colors h-10" v-for="(user, index) in items"
                            :key="index">
                            <td class="px-4 py-0.5 whitespace-nowrap text-center">{{ (pagination.page - 1) *
                                pagination.limit +
                                index + 1
                                }}</td>
                            <td class="px-4 py-0.5 whitespace-nowrap">{{ user.name }}</td>
                            <td class="px-4 py-0.5 whitespace-nowrap">{{ user.username }}</td>
                            <td class="px-4 py-0.5 whitespace-nowrap">{{ user.email }}</td>
                            <td class="px-4 py-0.5 whitespace-nowrap">{{ formatDate(user.createdAt) }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Pagination UI -->
        <div class="flex flex-col md:flex-row items-center justify-between px-2">
            <div class="text-sm text-gray-500 md:text-center md:mb-0 mb-4">
                Hiển thị từ {{ (pagination.page - 1) * pagination.limit + 1 }}-{{ Math.min(pagination.page *
                    pagination.limit, pagination.total) }} / {{ pagination.total }} kết quả
            </div>
            <div class="flex items-center gap-2">
                <Button variant="outline" size="icon-sm" :disabled="loading" @click="handleExport">
                    <FileSpreadsheet class="h-4 w-4 text-green-600" />
                </Button>
                <Button variant="outline" size="sm" :disabled="pagination.page <= 1 || loading"
                    @click="handlePageChange(pagination.page - 1)">
                    <ChevronLeft class="h-4 w-4 mr-1" /> Trước
                </Button>

                <div class="flex items-center gap-1">
                    <template v-for="(p, i) in displayedPages" :key="i">
                        <Button v-if="typeof p === 'number'" size="icon-sm"
                            :variant="p === pagination.page ? 'outline' : 'ghost'" @click="handlePageChange(p)"
                            :disabled="loading">
                            {{ p }}
                        </Button>
                        <span v-else class="px-2 text-gray-400">...</span>
                    </template>
                </div>

                <Button variant="outline" size="sm" :disabled="pagination.page >= pagination.totalPages || loading"
                    @click="handlePageChange(pagination.page + 1)">
                    Sau
                    <ChevronRight class="h-4 w-4 ml-1" />
                </Button>
            </div>
        </div>
    </div>
</template>
