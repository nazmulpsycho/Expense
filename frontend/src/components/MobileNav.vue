<template>
  <nav class="fixed bottom-0 left-0 right-0 z-50 border-t border-border/80 bg-dark/90 backdrop-blur-xl md:hidden">
    <div class="flex h-16 items-center justify-around px-2">
      <router-link to="/dashboard" class="flex flex-col items-center gap-0.5 text-xs font-medium text-text-muted transition-colors hover:text-text" active-class="text-neon-blue">
        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8zm0-14c-3.3 0-6 2.7-6 6s2.7 6 6 6 6-2.7 6-6-2.7-6-6-6z" />
        </svg>
        <span>Home</span>
      </router-link>
      <router-link to="/expenses" class="flex flex-col items-center gap-0.5 text-xs font-medium text-text-muted transition-colors hover:text-text" active-class="text-neon-blue">
        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <span>Expenses</span>
      </router-link>
      <router-link to="/reports" class="flex flex-col items-center gap-0.5 text-xs font-medium text-text-muted transition-colors hover:text-text" active-class="text-neon-blue">
        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <span>Reports</span>
      </router-link>
      <router-link to="/profile" class="flex flex-col items-center gap-0.5 text-xs font-medium text-text-muted transition-colors hover:text-text" active-class="text-neon-blue">
        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <span>Profile</span>
      </router-link>
    </div>
  </nav>
</template>
