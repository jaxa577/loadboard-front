<template>
  <NuxtLayout name="app">
    <div>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        {{ $t("load.myLoads") }}
      </h1>

      <!-- Tabs for Active/Archived -->
      <div class="mb-6">
        <div class="border-b border-gray-200 dark:border-gray-700">
          <nav class="-mb-px flex space-x-8">
            <button
              @click="activeTab = 'active'"
              :class="[
                'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                activeTab === 'active'
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300',
              ]"
            >
              {{ $t("load.activeLoads") }} ({{ activeLoads.length }})
            </button>
            <button
              @click="activeTab = 'archived'"
              :class="[
                'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                activeTab === 'archived'
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300',
              ]"
            >
              {{ $t("load.archivedLoads") }} ({{ archivedLoads.length }})
            </button>
          </nav>
        </div>
      </div>

      <div v-if="loading" class="text-center py-12">
        <div class="text-gray-500 dark:text-gray-400">
          {{ $t("common.loading") }}
        </div>
      </div>

      <div v-else-if="currentLoads.length === 0" class="text-center py-12">
        <div class="text-gray-500 dark:text-gray-400">
          {{
            activeTab === "active"
              ? $t("load.noActiveLoads")
              : $t("load.noArchivedLoads")
          }}
        </div>
      </div>

      <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <LoadCard
          v-for="load in currentLoads"
          :key="load.id"
          :load="load"
          :show-archive-button="activeTab === 'active'"
          @archive="handleArchive"
        />
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import type { Load } from "~/types";

const profileStore = useProfileStore();

const loading = ref(true);
const activeTab = ref("active");

const activeLoads = computed(() => {
  return profileStore.userLoads.filter((load) => load.status !== "ARCHIVED");
});

const archivedLoads = computed(() => {
  return profileStore.userLoads.filter((load) => load.status === "ARCHIVED");
});

const currentLoads = computed(() => {
  return activeTab.value === "active" ? activeLoads.value : archivedLoads.value;
});

const handleArchive = async (loadId: string) => {
  try {
    const config = useRuntimeConfig();
    const apiBase =
      config.public.apiBase || "https://api.loadboard.asia/api/v1";
    const authStore = useAuthStore();
    const token =
      authStore.token ||
      (process.client ? localStorage.getItem("token") : null);

    if (!token) {
      throw new Error("Not authenticated");
    }

    await $fetch(`${apiBase}/loads/${loadId}/archive`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Refresh loads
    await profileStore.fetchUserLoads();
  } catch (error) {
    console.error("Error archiving load:", error);
  }
};

onMounted(async () => {
  try {
    await profileStore.fetchUserLoads();
  } catch (error) {
    console.error("Error fetching loads:", error);
  } finally {
    loading.value = false;
  }
});

useHead({
  title: "Мои грузы - SNG LoadBoard",
});
</script>
