// --- قاعدة البيانات الافتراضية ---
        const ZGE_FileSystem = {
            "Project_Manifesto.md": "الرؤية الأساسية: يهدف مشروع ZGE إلى خلق بيئة تطويرية متكاملة تتجاوز النظم التقليدية، حيث يتم دمج 'الحدس البرمجي' مع الأتمتة الذكية. نحن لا نبني مجرد منصة، بل ننشئ كياناً رقمياً قادراً على النمو الذاتي من خلال خوارزميات التدفق (Flow Algorithms).",
            "Architecture.txt": "Distributed systems, High availability, Reactive UI components, Neural analytics."
        };

    let state = {
        manifesto: ZGE_FileSystem["Project_Manifesto.md"],
        index: [
            { id: "1", title: "وحدة الرأس", code: "Header", children: [
                { id: "1.1", title: "شريط التنقل", code: "Navbar", children: [] }
            ] }
        ],
        sparks: [
            { id: Date.now(), text: "تحسين استجابة الرسوم البيانية", done: false }
        ],
        ideas: [],
        history: [
            { id: "p1", title: "التأسيس", steps: [
                { id: "s1", title: "هيكلة النواة المركزية", tools: ["Docker", "Go-Lang"], events: ["خطوة 1", "خطوة 2", "خطوة 3", "خطوة 4"] }
            ] }
        ],
        activeSectionId: "section-doc"
    };

    function autoSync() {
        localStorage.setItem("ZGE_State", JSON.stringify(state));
        const dot = document.querySelector('footer .rounded-full');
        if (dot) {
            dot.classList.add('sync-active');
            setTimeout(() => dot.classList.remove('sync-active'), 2000);
        }
    }

    function loadState() {
        const saved = localStorage.getItem("ZGE_State");
        if (saved) {
            state = JSON.parse(saved);
        }
    }

    // --- UI Update Utilities ---
    function renderAll() {
        renderManifesto();
        renderHistory();
        renderIndex();
        renderSparks();
        renderClassifiedIdeas();
        renderActiveDev();
        updateNavStyles();
    }

    // --- SPA Routing ---
    function switchTab(tabId) {
        state.activeSectionId = tabId;
        const sections = ['section-doc', 'section-history', 'section-methodology', 'section-ideas'];
        sections.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.classList.toggle('hidden', id !== tabId);
        });
        updateNavStyles();
        autoSync();
    }

    function updateNavStyles() {
        const navMap = {
            'section-doc': 'nav-doc',
            'section-history': 'nav-history',
            'section-methodology': 'nav-methodology',
            'section-ideas': 'nav-ideas'
        };
        Object.values(navMap).forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.classList.remove('bg-[#00f0ff]/20', 'text-[#00f0ff]', 'rounded-full', 'border', 'border-[#00f0ff]/40', 'shadow-[0_0_10px_rgba(0,240,255,0.2)]');
                el.classList.add('text-[#dbfcff]/50', 'hover:text-[#dbfcff]');
            }
        });
        const activeId = navMap[state.activeSectionId];
        const activeEl = document.getElementById(activeId);
        if (activeEl) {
            activeEl.classList.add('bg-[#00f0ff]/20', 'text-[#00f0ff]', 'rounded-full', 'border', 'border-[#00f0ff]/40', 'shadow-[0_0_10px_rgba(0,240,255,0.2)]');
            activeEl.classList.remove('text-[#dbfcff]/50', 'hover:text-[#dbfcff]');
        }
    }

    // --- Components Implementation ---

    // Sovereign Document
    function renderManifesto() {
        const contentArea = document.querySelector('#section-doc .prose');
        if (contentArea) {
            contentArea.innerHTML = `<p>${state.manifesto}</p>`;
        }
    }

    function toggleEditManifesto() {
        const btn = document.querySelector('#section-doc button');
        const contentArea = document.querySelector('#section-doc .prose p');
        if (!contentArea) return;

        const isEditing = contentArea.getAttribute('contenteditable') === 'true';
        if (isEditing) {
            state.manifesto = contentArea.innerText;
            contentArea.setAttribute('contenteditable', 'false');
            contentArea.classList.remove('border', 'border-primary/50', 'p-2');
            btn.innerHTML = `<span  class="text-sm"><i data-lucide="edit-2"></i></span> تحرير الوثيقة`;
            autoSync();
        } else {
            contentArea.setAttribute('contenteditable', 'true');
            contentArea.classList.add('border', 'border-primary/50', 'p-2');
            contentArea.focus();
            btn.innerHTML = `<span  class="text-sm"><i data-lucide="save"></i></span> حفظ الوثيقة`;
        }
    }
    // Bind button
    document.querySelector('#section-doc button').onclick = toggleEditManifesto;

    // Technical Book Index
    function renderIndex() {
        const container = document.getElementById('index-tree-root');
        if (!container) return;
        container.innerHTML = "";

        function buildTree(items, parentContainer, level = 0) {
            items.forEach((item) => {
                const itemEl = document.createElement('div');
                itemEl.className = "group mb-1";
                const numbering = item.id.includes('.') ? item.id : item.id + ".0";
                itemEl.innerHTML = `
                    <div class="flex flex-col">
                        <div class="dotted-leader py-1 cursor-pointer hover:bg-white/5 transition-colors px-2 rounded">
                            <span class="text-[10px] md:text-xs font-bold text-on-surface whitespace-nowrap">${numbering} ${item.title}</span>
                            ${item.children && item.children.length > 0 ? '<span  class="text-[14px] text-primary/40 ml-2"><i data-lucide="chevrons-up-down"></i></span>' : ''}
                        </div>
                        <div class="mr-4 mt-1 space-y-1 hidden" id="child-of-${item.id.replace(/\./g, '_')}"></div>
                    </div>
                `;
                itemEl.querySelector('.dotted-leader').onclick = (e) => {
                    const childCont = document.getElementById(`child-of-${item.id.replace(/\./g, '_')}`);
                    if (childCont) childCont.classList.toggle('hidden');
                };
                parentContainer.appendChild(itemEl);
                if (item.children && item.children.length > 0) {
                    const childCont = document.getElementById(`child-of-${item.id.replace(/\./g, '_')}`);
                    buildTree(item.children, childCont, level + 1);
                }
            });
        }
        buildTree(state.index, container);
        updateCategorySelects();
    }

    function addIndexSection() {
        const title = prompt("عنوان القسم الجديد:");
        if (title) {
            const nextId = (state.index.length + 1).toString();
            state.index.push({ id: nextId, title: title, children: [] });
            renderIndex();
            autoSync();
        }
    }

    // Sparks (To-Do)
    function renderSparks() {
        const list = document.getElementById('sparks-list');
        if (!list) return;
        list.innerHTML = state.sparks.map(spark => `
            <div class="flex items-center gap-3 bg-surface-container-high/40 p-2 rounded group">
                <input type="checkbox" ${spark.done ? 'checked' : ''} onchange="toggleSpark(${spark.id})" class="rounded border-secondary/40 bg-transparent text-secondary focus:ring-0">
                <span class="text-xs flex-1 ${spark.done ? 'line-through opacity-50' : ''}">${spark.text}</span>
                <button onclick="deleteSpark(${spark.id})"  class="text-xs text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"><i data-lucide="trash-2"></i></button>
            </div>
        `).join('');
    }

    function addSpark() {
        const input = document.getElementById('spark-input');
        if (input && input.value) {
            state.sparks.push({ id: Date.now(), text: input.value, done: false });
            input.value = "";
            renderSparks();
            autoSync();
        }
    }

    function toggleSpark(id) {
        const spark = state.sparks.find(s => s.id === id);
        if (spark) {
            spark.done = !spark.done;
            renderSparks();
            autoSync();
        }
    }

    function deleteSpark(id) {
        state.sparks = state.sparks.filter(s => s.id !== id);
        renderSparks();
        autoSync();
    }

    // Classified Ideas
    function updateCategorySelects() {
        const selects = ['idea-category-select', 'active-dev-filter'];
        selects.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                const options = state.index.map(item => `<option value="${item.id}">${item.title}</option>`).join('');
                el.innerHTML = options + (id === 'active-dev-filter' ? '<option value="all">الكل</option>' : '');
            }
        });
    }

    function renderClassifiedIdeas() {
        // Not used for list display here, see active dev
    }

    function addClassifiedIdea() {
        const titleInput = document.getElementById('idea-title');
        const catSelect = document.getElementById('idea-category-select');
        if (titleInput.value && catSelect.value) {
            state.ideas.push({
                id: Date.now(),
                title: titleInput.value,
                categoryId: catSelect.value
            });
            titleInput.value = "";
            renderActiveDev();
            autoSync();
        }
    }

    // Active Dev (Filtered)
    function renderActiveDev() {
        const list = document.getElementById('active-dev-list');
        const filter = document.getElementById('active-dev-filter').value;
        if (!list) return;

        const filtered = filter === 'all' ? state.ideas : state.ideas.filter(i => i.categoryId === filter);

        list.innerHTML = filtered.map(idea => `
            <div class="flex items-center gap-4 p-3 bg-[#0b0e14] rounded border-l-2 border-primary">
                <span  class="text-primary text-xl"><i data-lucide="terminal"></i></span>
                <div>
                    <p class="text-xs font-bold">${idea.title}</p>
                    <p class="text-[9px] text-primary/60">${state.index.find(c => c.id === idea.categoryId)?.title || ''}</p>
                </div>
            </div>
        `).join('');
    }

    function filterActiveDev() {
        renderActiveDev();
    }

    // Development History
    function renderHistory() {
        const container = document.querySelector('#section-history .grid');
        if (!container) return;
        container.innerHTML = state.history.map(phase => `
            <div class="glass-panel p-4 md:p-6 rounded-xl border-r-4 border-primary active-glow relative">
                <div class="flex justify-between items-start mb-4">
                    <div class="text-primary font-bold tech-monospace text-xs md:text-base">${phase.title}</div>
                    <div class="flex gap-1">
                        <button onclick="editPhase('${phase.id}')"  class="text-xs opacity-40 hover:opacity-100"><i data-lucide="edit-2"></i></button>
                        <button onclick="deletePhase('${phase.id}')"  class="text-xs text-red-400 opacity-40 hover:opacity-100"><i data-lucide="trash-2"></i></button>
                    </div>
                </div>
                <div class="space-y-4">
                    ${phase.steps.map(step => `
                        <div class="bg-primary/5 p-3 rounded-lg border border-primary/20">
                            <div class="flex justify-between items-center text-[10px] text-primary mb-1">
                                <span>${step.title}</span>
                                <div class="flex gap-1">
                                    <button onclick="editStep('${phase.id}', '${step.id}')"  class="text-[12px] opacity-40"><i data-lucide="edit-2"></i></button>
                                    <button onclick="deleteStep('${phase.id}', '${step.id}')"  class="text-[12px] text-red-400 opacity-40"><i data-lucide="trash-2"></i></button>
                                </div>
                            </div>
                            <div class="mt-2 text-[10px] flex flex-wrap gap-1 opacity-60">
                                ${step.tools.map(tool => `<span class="bg-surface-container-high px-2 py-0.5 rounded">${tool}</span>`).join('')}
                            </div>
                            <div class="mt-2 space-y-1">
                                ${step.events ? step.events.map(event => `
                                    <div class="flex items-center gap-2 text-[9px] text-tertiary/70">
                                        <span class="w-1 h-1 rounded-full bg-tertiary"></span> ${event}
                                    </div>
                                `).join('') : ''}
                            </div>
                        </div>
                    `).join('')}
                    <button onclick="addStep('${phase.id}')" class="w-full border border-dashed border-primary/20 rounded py-2 text-[10px] text-primary/40 hover:bg-primary/5">+ خطوة جديدة</button>
                </div>
            </div>
        `).join('') + `
            <button onclick="addPhase()" class="glass-panel p-6 rounded-xl border-2 border-dashed border-primary/20 flex items-center justify-center text-primary/40 hover:bg-primary/5 transition-all">
                <span  class="mr-2"><i data-lucide="plus-circle"></i></span> إضافة مرحلة
            </button>
        `;
    }

    function addPhase() {
        const title = prompt("عنوان المرحلة:");
        if (title) {
            state.history.push({ id: 'p' + Date.now(), title: title, steps: [] });
            renderHistory();
            autoSync();
        }
    }

    function deletePhase(id) {
        state.history = state.history.filter(p => p.id !== id);
        renderHistory();
        autoSync();
    }

    function addStep(phaseId) {
        const title = prompt("عنوان الخطوة:");
        if (title) {
            const phase = state.history.find(p => p.id === phaseId);
            if (phase) {
                phase.steps.push({ id: 's' + Date.now(), title: title, tools: ["New Tool"], events: ["حدث 1", "حدث 2", "حدث 3", "حدث 4"] });
                renderHistory();
                autoSync();
            }
        }
    }

    function editPhase(id) {
        const phase = state.history.find(p => p.id === id);
        if (phase) {
            const newTitle = prompt("العنوان الجديد للمرحلة:", phase.title);
            if (newTitle) {
                phase.title = newTitle;
                renderHistory();
                autoSync();
            }
        }
    }

    function editStep(phaseId, stepId) {
        const phase = state.history.find(p => p.id === phaseId);
        if (phase) {
            const step = phase.steps.find(s => s.id === stepId);
            if (step) {
                const newTitle = prompt("العنوان الجديد للخطوة:", step.title);
                if (newTitle) {
                    step.title = newTitle;
                    renderHistory();
                    autoSync();
                }
            }
        }
    }

    function deleteStep(phaseId, stepId) {
        const phase = state.history.find(p => p.id === phaseId);
        if (phase) {
            phase.steps = phase.steps.filter(s => s.id !== stepId);
            renderHistory();
            autoSync();
        }
    }

    // Initialize
    loadState();
    renderAll();


// --- تفعيل أيقونات Lucide تلقائياً عند تغيرات DOM ---
const observer = new MutationObserver(() => {
    lucide.createIcons();
});
observer.observe(document.body, { childList: true, subtree: true });
document.addEventListener("DOMContentLoaded", () => lucide.createIcons());