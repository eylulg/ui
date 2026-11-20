# Changelog

## [1.1.0](https://github.com/eylulg/ui/compare/v1.0.0...v1.1.0) (2026-11-20)

### Features

* **footer:** group projects into Live and Code ([#26](https://github.com/eylulg/ui/issues/26)) ([662dfc7](https://github.com/eylulg/ui/commit/662dfc7ab3f45575d00a37d0bb49e60b191bde92))

### Bug Fixes

* invisible touch targets, scrolling tabs and reduced motion ([#24](https://github.com/eylulg/ui/issues/24)) ([7aec6d6](https://github.com/eylulg/ui/commit/7aec6d6c0ae2a40cac5e7e41881adf4855a1af72))
* **storybook:** follow the toolbar theme everywhere and drop the box behind stories ([#23](https://github.com/eylulg/ui/issues/23)) ([59e4192](https://github.com/eylulg/ui/commit/59e41929d29f030e5883d846d80e99890c638ed8))

## 1.0.0 (2026-11-20)

### ⚠ BREAKING CHANGES

* **theme:** the variant types lose pairing, textSize and density,
  and the pairings, densities, textSizes and textSizeLines exports are gone.
  The variant CSS files no longer set --font-display, --ui-font-data,
  --ui-text-size, --density-* or --text-*. The Inter Tight and Newsreader
  font peers, and their --font-* variables in fonts.css, are removed. The
  visitor text size setting stays, and now starts at default text in every
  theme.
* **theme:** variants no longer have brand, gray, warning, radius,
  fonts or dark fields, and the grays, radii, displayFont and monoFont
  exports are gone. Read seed, pairing, textSize and density instead.
  The base theme is Clay on warm grays, and radii are larger everywhere.

### Features

* add accessible components built on React Aria ([2d9b1d7](https://github.com/eylulg/ui/commit/2d9b1d7df73a74ef42924d1671659fc5dee32658))
* add Avatar, Breadcrumbs, Card, EmptyState and PageHeader ([79aacec](https://github.com/eylulg/ui/commit/79aacec71fb79ac79f06874fb66ce8622d1b6329))
* add Combobox, CommandPalette, Kbd, ProgressBar and Spinner ([555c277](https://github.com/eylulg/ui/commit/555c277b1f481bfa87d3fdef44182ceda78af15b))
* add FileDropZone ([399c20c](https://github.com/eylulg/ui/commit/399c20c719ae5122134b8215c9c93127488e304d))
* add PageHeader eyebrow, EmptyState level 1 headings and Dialog header actions ([f024696](https://github.com/eylulg/ui/commit/f0246965b4872e698eb748df88cdb2c180cc714e))
* add plain tokens.css for non-Tailwind apps and an opt-in fonts.css for Inter ([a9d24c5](https://github.com/eylulg/ui/commit/a9d24c56a8743f482202c85c58a99a31286a095a))
* add Popover, DropdownMenu and Drawer ([190cb88](https://github.com/eylulg/ui/commit/190cb88f88a940273ac57fdbdf43ceb98273e73c))
* add SegmentedControl ([d3c1dc7](https://github.com/eylulg/ui/commit/d3c1dc71e81422da3a125944a670f3e76d5b13de))
* add Select option descriptions, Stat sizes and dl semantics, Card padding none ([65e157e](https://github.com/eylulg/ui/commit/65e157e8647fd954efa39239f281d48a939b2f10))
* add SidebarNav item actions, Textarea data font and autocorrect options, and CodeBlock ([e952720](https://github.com/eylulg/ui/commit/e952720277d8166fc05c953a1ed50d68c1852996))
* add Table, DatePicker, DateRangePicker, Pagination and Stat ([e4d412e](https://github.com/eylulg/ui/commit/e4d412eae69e73dc3689ae426a3a1497020e0e5b))
* **badge:** add blue, purple, pink, orange and indigo colours ([c0c2248](https://github.com/eylulg/ui/commit/c0c22482ce04e4f67131ac39909b522b42caab98))
* **button:** render a link with href, add destructive-outline and export buttonStyles ([3d4c640](https://github.com/eylulg/ui/commit/3d4c6408c7b51323afeb13368f95ad1e85b5aea8))
* **chart:** add line, bar and heat grid charts ([#9](https://github.com/eylulg/ui/issues/9)) ([2274001](https://github.com/eylulg/ui/commit/227400156a80ece2d2889f984b31704b09407543))
* **chrome:** add shared app chrome at @eylulg/ui/chrome ([12485a2](https://github.com/eylulg/ui/commit/12485a24d24a537b80b5b661ca039188fe6b4469))
* **chrome:** add useTheme, translatable labels, a TopNav centre slot and a lazy mobile menu ([b533cd0](https://github.com/eylulg/ui/commit/b533cd0888b22d439a7add99369226687d8c8fdc))
* **chrome:** export themeInitScript from @eylulg/ui/theme-script ([2942df2](https://github.com/eylulg/ui/commit/2942df29a54a351311483af0a0c004bd978dc3aa))
* **command-palette:** add nested pages, onSearchChange and closeOnAction ([6855d7b](https://github.com/eylulg/ui/commit/6855d7b77ec52ddca69932bf4e3d450834779238))
* forward refs on Button, IconButton, Input, Textarea, Select and Switch ([3d09458](https://github.com/eylulg/ui/commit/3d09458afa3db1bb1841995a2f937c3240eec783))
* **projects:** add Assistant Studio to the project list ([f4d4b9e](https://github.com/eylulg/ui/commit/f4d4b9e8f5d3cb7755a69fbc9aec8483f93b5284))
* **projects:** feature agent workflows and the research assistant ([#10](https://github.com/eylulg/ui/issues/10)) ([8128195](https://github.com/eylulg/ui/commit/8128195d376cca572f26922caf5e3c093f1ccd15))
* **theme:** add density, display font and data font tokens and dark-mode class ([c9bddff](https://github.com/eylulg/ui/commit/c9bddfff08fbbc57709413a8558a284f67f9c65c))
* **theme:** add Tailwind 4 design tokens, cx util and test helpers ([28c3d09](https://github.com/eylulg/ui/commit/28c3d098d5e96435d7b026a8e3821701b2887dd3))
* **theme:** build the Clay design language into the themes ([#20](https://github.com/eylulg/ui/issues/20)) ([79efd8f](https://github.com/eylulg/ui/commit/79efd8f51ff66a004b3797c8cc006136715f96cd))
* **theme:** make themes change colour only, with the final logo ([#22](https://github.com/eylulg/ui/issues/22)) ([877e0a1](https://github.com/eylulg/ui/commit/877e0a1e987836dcaee98231c396b2c7eb43c2f7))
* **themes:** add eight project theme variants with an AA contrast check ([0a93f11](https://github.com/eylulg/ui/commit/0a93f11517f55b4491e89a7e5394e05587156840))
* **themes:** add the assistant variant ([0040084](https://github.com/eylulg/ui/commit/00400844199feea14b06f168b9a3e44e46c3b737))
* **themes:** move the assistant variant to magenta ([1329ea8](https://github.com/eylulg/ui/commit/1329ea88c5089a0c324e9777e6fa1f8642a4f236))
* **themes:** move the control-room warning scale to yellow ([1d9b86a](https://github.com/eylulg/ui/commit/1d9b86ace76c842030ef12703a85242e50ebefa0))
* **toast:** add an action button and return focus when a focused toast closes ([63e2c7a](https://github.com/eylulg/ui/commit/63e2c7a07419230e8b07720f0fc548b284fedd2d))
* **tokens:** add the type scale to tokens.css and an optional reset.css ([498c6d2](https://github.com/eylulg/ui/commit/498c6d21ace31513e7a3ff22877fb9f8bd6f438a))

### Bug Fixes

* **a11y:** give the SidebarNav section toggle a 24px target ([d01c7d5](https://github.com/eylulg/ui/commit/d01c7d5bce4d5678a27505683d7ddea55da9f2f3))
* **a11y:** make Avatar and menu item names contain their visible text ([08eedd4](https://github.com/eylulg/ui/commit/08eedd44c3a2bb869289d4964da2b69c92d07053))
* **chrome:** keep react-aria-components out of TopNav's first load ([078ec50](https://github.com/eylulg/ui/commit/078ec5014dbf6fa854ede154ecc7ba7fbff215c0))
* **chrome:** load links to other projects as pages ([#17](https://github.com/eylulg/ui/issues/17)) ([0233c7d](https://github.com/eylulg/ui/commit/0233c7d4ee3e339faeb198f269bc6c55fc56df31))
* **combobox:** name options by label then description ([d665058](https://github.com/eylulg/ui/commit/d665058a165bf4a41f0be8e4f7e11a0455a9ed52))
* **command-palette:** pass label-in-name and scrollable-region axe rules ([ca074fd](https://github.com/eylulg/ui/commit/ca074fd631c2a33fa6dff5611c0b97b297eae48f))
* **cx:** make @eylulg/ui/cx a pure module safe in server components ([e7b6a79](https://github.com/eylulg/ui/commit/e7b6a79e2a6557b5cbae47765010db6fe55b2f74))
* **docs:** document copied installs, the projects prop and the plain reset ([eddd837](https://github.com/eylulg/ui/commit/eddd8379259390ba15660f9f20fc6c03ef68102c))
* **docs:** render MDX tables, follow the Theme toolbar and hide element controls ([44be06c](https://github.com/eylulg/ui/commit/44be06c500be0d19370159111109f8ea17752519))
* **focus:** render the keyboard focus ring and check it in Chromium ([88dd2ab](https://github.com/eylulg/ui/commit/88dd2abcda801b9215b4b0861d5abaa3e2b2503d))
* **fonts:** shipped the font packages with the library ([#25](https://github.com/eylulg/ui/issues/25)) ([23cfe48](https://github.com/eylulg/ui/commit/23cfe486af57b72a2cdcce1c9390ad3312b93163))
* keep Switch inputRef and accept string spellCheck on Textarea ([932b671](https://github.com/eylulg/ui/commit/932b671cfb87a0fae9b0c2227c2113dca6e7c70a))
* **projects:** describe the sudoku game accurately ([8a4beaf](https://github.com/eylulg/ui/commit/8a4beaf6e41ec8b348009a2c703081b778072476))
* **projects:** link agent workflows to its live site ([#16](https://github.com/eylulg/ui/issues/16)) ([df9e09c](https://github.com/eylulg/ui/commit/df9e09c6565641c84b7dd5e1098f32c09021bdec))
* **projects:** mark the Storybook as planned until Pages is live ([82112b3](https://github.com/eylulg/ui/commit/82112b3174749a3661e4bb6a639cbc09f89b0fb9))
* **stories:** make DropdownMenu, Drawer and Popover keyboard stories pass ([4a9137f](https://github.com/eylulg/ui/commit/4a9137f2a01b07b0c278e27b9e1d36a8fc824952))
* **storybook:** centre stories, theme dark mode, one chart entry ([#18](https://github.com/eylulg/ui/issues/18)) ([8d9c6b6](https://github.com/eylulg/ui/commit/8d9c6b6ec14bc5e15338c74862efa3d48f25734e))
* **storybook:** let the theme overview follow the theme toolbar ([#21](https://github.com/eylulg/ui/issues/21)) ([87b1714](https://github.com/eylulg/ui/commit/87b17149c1a275794b5d2bae377fbcc08585776d))
* **theme-toggle:** make inline buttons at least 24 by 24 px ([9a0e0d9](https://github.com/eylulg/ui/commit/9a0e0d98c261dfbea7562443e750909c89a19e31))
* **tokens:** keep white text on solid hover fills at AA in dark ([0469c6d](https://github.com/eylulg/ui/commit/0469c6d56a059d869f68de61faaa07f88c931fd9))

### Performance Improvements

* **chrome:** load the project and theme menus on first press ([b6aa3dd](https://github.com/eylulg/ui/commit/b6aa3dd02febc41d109b1d4a1166c425a6243cc9))
* **cx:** add cx-lite without tailwind-merge ([a82731c](https://github.com/eylulg/ui/commit/a82731c319fab11d97e60132ffc88fe0516495c2))
* measure bundles per entry and lower the size budgets ([6ae78be](https://github.com/eylulg/ui/commit/6ae78be7e69f0cbd1b13f2c09e93acb7fb9ccb32))
* **overlays:** load overlays on first open ([b4bbb01](https://github.com/eylulg/ui/commit/b4bbb01dfd86d42dc6c82002317a61338e3f3f5b))
* **table:** adopt the server markup on hydration ([367c960](https://github.com/eylulg/ui/commit/367c9604427d24f500aca39d00d9d30ce3294f1a))

This file is generated by semantic-release from Conventional Commits. Do not edit it by hand.
