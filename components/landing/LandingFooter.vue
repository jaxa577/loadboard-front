<template>
  <footer class="bg-gray-900 dark:bg-black text-gray-300 py-16">
    <div class="container mx-auto px-4">
      <div class="grid md:grid-cols-4 gap-8 mb-12">
        <div>
          <h3 class="text-2xl font-bold text-white mb-4">SNG LoadBoard</h3>
          <p class="text-gray-400">
            {{ $t('landing.hero.subtitle') }}
          </p>
        </div>

        <div>
          <h4 class="text-white font-semibold mb-4">{{ $t('landing.footer.platform') }}</h4>
          <ul class="space-y-2">
            <li><NuxtLink to="/loads" class="hover:text-white transition-colors">{{ $t('nav.loads') }}</NuxtLink></li>
            <li><NuxtLink to="/chat" class="hover:text-white transition-colors">{{ $t('nav.messages') }}</NuxtLink></li>
            <li><NuxtLink to="/profile" class="hover:text-white transition-colors">{{ $t('nav.profile') }}</NuxtLink></li>
          </ul>
        </div>

        <div>
          <h4 class="text-white font-semibold mb-4">{{ $t('landing.footer.about') }}</h4>
          <ul class="space-y-2">
            <li><a href="#" class="hover:text-white transition-colors">О компании</a></li>
            <li><a href="#" class="hover:text-white transition-colors">Контакты</a></li>
            <li><a href="#" class="hover:text-white transition-colors">Партнеры</a></li>
          </ul>
        </div>

        <div>
          <h4 class="text-white font-semibold mb-4">{{ $t('landing.footer.legal') }}</h4>
          <ul class="space-y-2">
            <li><a href="#" class="hover:text-white transition-colors">Политика конфиденциальности</a></li>
            <li><a href="#" class="hover:text-white transition-colors">Условия использования</a></li>
            <li><a href="#" class="hover:text-white transition-colors">Правила платформы</a></li>
          </ul>
        </div>
      </div>

      <div class="border-t border-gray-800 pt-8 text-center text-gray-400">
        <p>{{ $t('landing.footer.copyright') }}</p>
      </div>
    </div>
  </footer>
</template>

