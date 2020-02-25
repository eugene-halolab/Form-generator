<header class="clearfix main-header ">
            <div class="header-container container">
                <div class="header-left">
                    <a aria-current="page" rel="home" class="" href="{{ url('/') }}">
                       <img src="{{ asset('img/header-logo.svg') }}">
                   </a>
               </div>
               <div class="header-center">
                <form>
                    <div>
                        <input type="text" name="search">
                    </div>
                </form>
            </div>
            <div class="header-right">
                @guest
                <a href="{{ route('login') }}">{{ __('Login') }}</a>
                @if (Route::has('register'))
                <a href="{{ route('register') }}">{{ __('Register') }}</a>
                @endif
                @else
                <a href="{{ route('logout') }}" onclick="event.preventDefault(); document.getElementById('logout-form').submit();">
                    {{ __('Logout') }}
                </a>
                @endguest
            </div>
        </div>
    </header>