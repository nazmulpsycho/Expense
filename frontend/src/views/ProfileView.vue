<template>
  <div class="layout-container">
    <div class="flex flex-1 flex-col gap-6 p-6 lg:p-8">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-text lg:text-3xl">Profile</h1>
          <p class="mt-1 text-sm text-text-dim">Manage account details and security.</p>
        </div>
      </div>

      <div class="grid gap-6 lg:grid-cols-3">
        <div class="rounded-2xl border border-border/60 bg-dark-card/70 p-6 shadow-lg backdrop-blur-xl lg:col-span-1">
          <div class="flex flex-col items-center text-center">
            <div class="flex h-20 w-20 items-center justify-center rounded-full border-2 border-border/60 bg-dark overflow-hidden shadow-lg">
              <img v-if="profile.avatar" :src="profile.avatar" alt="avatar" class="h-full w-full object-cover" />
              <span v-else class="text-4xl font-bold text-text-dim">{{ initials }}</span>
            </div>
            <h2 class="mt-4 text-xl font-bold text-text">{{ profile.name }}</h2>
            <p class="text-sm text-text-dim">@{{ profile.username }}</p>
            <div class="mt-6 flex gap-2">
              <input
                type="file"
                accept="image/png, image/jpeg, image/webp"
                class="hidden"
                ref="fileInput"
                @change="handleAvatarChange"
              />
              <button type="button" class="secondary-button flex items-center gap-2 rounded-xl border border-border bg-dark-card/70 px-4 py-2 text-sm font-medium text-text transition-all hover:bg-dark-card hover:border-border/80" @click="fileInput?.click()">
                <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                </svg>
                Upload photo
              </button>
            </div>
          </div>

          <div class="mt-6 border-t border-border/40 pt-6 text-sm text-text-dim">
            <p>Member since {{ formatDate(profile.createdAt) }}</p>
          </div>
        </div>

        <div class="lg:col-span-2 space-y-6">
          <div class="rounded-2xl border border-border/60 bg-dark-card/70 p-6 shadow-lg backdrop-blur-xl">
            <h3 class="text-lg font-semibold text-text">Personal information</h3>
            <form class="mt-4 grid gap-4 sm:grid-cols-2" @submit.prevent="saveProfile">
              <div class="flex flex-col gap-1">
                <label for="name" class="text-sm font-medium text-text">Full name</label>
                <input id="name" v-model="form.name" type="text" class="input" />
              </div>
              <div class="flex flex-col gap-1">
                <label for="username" class="text-sm font-medium text-text">Username</label>
                <input id="username" v-model="form.username" type="text" class="input" />
              </div>
              <div class="sm:col-span-2 flex flex-col gap-1">
                <label for="email" class="text-sm font-medium text-text">Email address</label>
                <input id="email" v-model="form.email" type="email" class="input" />
              </div>
              <div class="sm:col-span-2 flex justify-end">
                <button type="submit" class="btn-primary flex items-center gap-2 rounded-xl px-5 py-2 text-sm font-semibold" :disabled="saving">
                  <span v-if="saving">Saving…</span>
                  <span v-else>Save changes</span>
                </button>
              </div>
            </form>
          </div>

          <div class="rounded-2xl border border-border/60 bg-dark-card/70 p-6 shadow-lg backdrop-blur-xl">
            <h3 class="text-lg font-semibold text-text">Change password</h3>
            <form class="mt-4 grid gap-4 sm:grid-cols-2" @submit.prevent="changePassword">
              <div class="flex flex-col gap-1">
                <label for="currentPassword" class="text-sm font-medium text-text">Current password</label>
                <input id="currentPassword" v-model="passwordForm.current" type="password" class="input" />
              </div>
              <div class="flex flex-col gap-1">
                <label for="newPassword" class="text-sm font-medium text-text">New password</label>
                <input id="newPassword" v-model="passwordForm.newPassword" type="password" class="input" />
              </div>
              <div class="sm:col-span-2 flex justify-end">
                <button type="submit" class="btn-primary flex items-center gap-2 rounded-xl px-5 py-2 text-sm font-semibold" :disabled="passwordSaving">
                  <span v-if="passwordSaving">Updating…</span>
                  <span v-else>Update password</span>
                </button>
              </div>
            </form>
            <p v-if="passwordMessage" class="mt-3 text-sm text-text-dim">{{ passwordMessage }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue';
import { useAuthStore } from '../stores/auth';
import { formatDate } from '../utils/format';

const authStore = useAuthStore();

const saving = ref(false);
const passwordSaving = ref(false);
const passwordMessage = ref('');

const profile = computed(() => authStore.user || {
  name: 'Jane Doe',
  username: 'janedoe',
  email: 'jane@example.com',
  createdAt: new Date().toISOString(),
});

const initials = computed(() => (profile.value.name || '?').slice(0, 2).toUpperCase());

const form = reactive({
  name: profile.value.name,
  username: profile.value.username,
  email: profile.value.email,
});

const passwordForm = reactive({
  current: '',
  newPassword: '',
});

function handleAvatarChange(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    authStore.setUser({ ...authStore.user, avatar: reader.result }, authStore.token);
  };
  reader.readAsDataURL(file);
}

async function saveProfile() {
  saving.value = true;
  try {
    await new Promise((resolve) => setTimeout(resolve, 600));
    authStore.setUser({ ...authStore.user, ...form }, authStore.token);
  } finally {
    saving.value = false;
  }
}

async function changePassword() {
  if (!passwordForm.current || !passwordForm.newPassword) {
    passwordMessage.value = 'Please enter both your current and new password.';
    return;
  }
  passwordSaving.value = true;
  passwordMessage.value = '';
  try {
    await new Promise((resolve) => setTimeout(resolve, 600));
    passwordMessage.value = 'Password updated successfully.';
    passwordForm.current = '';
    passwordForm.newPassword = '';
  } finally {
    passwordSaving.value = false;
  }
}
</script>
