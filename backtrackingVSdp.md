# Backtracking vs Dynamic Programming (C++) — exactly when to use which, with many real examples

No sugarcoating: there are two fundamentally different ways to attack problems that *feel* similar. Backtracking is *search/enumeration with pruning* (often exponential). Dynamic Programming (DP) is *reusing overlapping subproblems to avoid repeated work* (can be polynomial or exponential depending on state-space). Choose by asking **three** questions (read this checklist first):

1. **What does the problem ask for?**

   * *List all solutions* → backtracking (you must generate them).
   * *Any/one solution* or *existence* or *count/maximum/minimum value* → consider DP.
2. **Are there overlapping subproblems + optimal substructure?**

   * If yes → DP (memoization or bottom-up).
3. **What are the constraints (n, target, W)?**

   * If n is tiny (≤12–15) you can backtrack/bitmask; if n grows and state-space is manageable (n * W), DP is preferable.

Below I’ll explain the patterns, give thought-process for each example, then show C++ code. After this you should *never* be confused because you’ll have a checklist + concrete examples.

---

# 1) Quick definitions / patterns (direct)

* **Backtracking**

  * Pattern: build candidate step-by-step, reject early when a partial candidate violates constraints, backtrack.
  * Use when: you need to **enumerate** solutions, or apply heavy constraints where pruning reduces exponential search enough to be feasible.
  * Complexity: usually exponential (n!, 2^n, etc), but pruning can cut a lot.

* **Dynamic Programming (DP)**

  * Pattern: identify state, recurrence, overlapping subproblems; store computed results to avoid recomputation (memoization) or compute bottom-up.
  * Use when: problem asks for an **optimal value**, **count**, or **existence** and the problem has **overlapping subproblems + optimal substructure**.
  * Complexity: typically polynomial in size of state-space (e.g., O(nW) for knapsack), but can be exponential in bits of state (e.g., bitmask DP O(n^2·2^n)).

---

# 2) Decision checklist you must run *every time* before coding

1. **Output type**: enumerate all → backtracking. Value/count/existence/optimization → DP (if states manageable).
2. **Constraints**: if n small (≤15–20) brute force/backtracking/bitmask can be ok. If target/weights small → DP by weight/dp array.
3. **Subproblems**: can you express solution in terms of smaller subproblems that repeat? If yes → DP.
4. **NP-hard candidates**: problems like Hamiltonian path/TSP/graph coloring are NP-hard — use backtracking with pruning, or exponential DP (bitmask) if n small.
5. **Time bound in interview**: if asked for single value/min cost and overlap exists — DP is usually the intended solution.

---

# 3) Backtracking — pattern + examples (with C++)

## Pattern / thought-process

1. Identify decision points (choose next element or not).
2. Write a recursive function `dfs(params)` that:

   * If `goal` reached -> record solution.
   * Otherwise iterate possible choices for this level.
   * For each choice: apply it, recurse, undo it (backtrack).
3. Add pruning checks before recursing (feasible checks).
4. If you must produce *all* valid results, backtracking is the right tool.

### Example A — Permutations (generate all)

Thought process: you must generate all orderings → must enumerate → backtracking (swap approach).

```cpp
// Generate all permutations of nums
#include <bits/stdc++.h>
using namespace std;

void permute(vector<int>& a, int l, vector<vector<int>>& out){
    if(l == (int)a.size()){
        out.push_back(a);
        return;
    }
    for(int i = l; i < (int)a.size(); ++i){
        swap(a[l], a[i]);
        permute(a, l+1, out);
        swap(a[l], a[i]); // backtrack
    }
}

int main(){
    vector<int> a = {1,2,3};
    vector<vector<int>> out;
    permute(a, 0, out);
    for(auto &v: out){
        for(int x: v) cout << x << ' ';
        cout << '\n';
    }
}
```

Complexity: O(n * n!) time, O(n) recursion space + O(n!*n) to store results.

---

### Example B — N-Queens (pruning-critical)

Thought process: place queens row by row; prune immediately on column/diagonal conflicts. You must enumerate or count valid boards → backtracking with pruning.

```cpp
#include <bits/stdc++.h>
using namespace std;

void solveNQ(int r, int n, vector<int>& cols, vector<int>& diag1, vector<int>& diag2, vector<int>& board, vector<vector<int>>& res){
    if(r == n){
        res.push_back(board);
        return;
    }
    for(int c=0;c<n;++c){
        if(cols[c] || diag1[r+c] || diag2[r-c + n - 1]) continue;
        cols[c] = diag1[r+c] = diag2[r-c + n - 1] = 1;
        board[r] = c;
        solveNQ(r+1, n, cols, diag1, diag2, board, res);
        cols[c] = diag1[r+c] = diag2[r-c + n - 1] = 0; // backtrack
    }
}

int main(){
    int n = 8;
    vector<int> cols(n), diag1(2*n), diag2(2*n), board(n);
    vector<vector<int>> res;
    solveNQ(0, n, cols, diag1, diag2, board, res);
    cout << "Solutions: " << res.size() << '\n';
}
```

Reason: pruning (constant-time checks) reduces the exponential tree substantially.

---

### Example C — Combination Sum (must enumerate combinations)

Thought process: you need all combinations (unordered sets that sum to target). Backtracking with controlled choices (start index) and pruning by target < 0.

```cpp
#include <bits/stdc++.h>
using namespace std;

void combSum(vector<int>& cand, int idx, int target, vector<int>& cur, vector<vector<int>>& out){
    if(target == 0){
        out.push_back(cur);
        return;
    }
    if(target < 0) return;
    for(int i=idx; i<(int)cand.size(); ++i){
        cur.push_back(cand[i]);
        combSum(cand, i, target - cand[i], cur, out); // i -> allow reuse
        cur.pop_back();
    }
}

int main(){
    vector<int> cand = {2,3,6,7};
    int target = 7;
    vector<vector<int>> out; vector<int> cur;
    combSum(cand, 0, target, cur, out);
    for(auto &v: out){ for(int x: v) cout<<x<<' '; cout<<'\n'; }
}
```

Why backtracking: the output is all combinations — DP could count them, but to list actual combinations we must search.

---

### Other classic backtracking problems (you must use backtracking)

* Word Search in a board (LeetCode 79) — DFS with visited mask.
* Sudoku solver — backtracking across 9×9 cells with row/col/box pruning.
* Hamiltonian path or Hamiltonian cycle (search problem in graphs).
* Generating subsets (if you must output all subsets).

---

# 4) Dynamic Programming — pattern + examples (with C++)

## Pattern / thought-process

1. Identify **state** (parameters that define subproblem).
2. Write recurrence relating state to smaller states.
3. Decide if top-down memoization or bottom-up table is easier.
4. Complexity = number of states × cost per state.

**Key: DP is for problems with overlapping subproblems. If your recursion recomputes the same `(i, target)` pair many times → use DP.**

---

### Example D — Fibonacci: naive recursion → memoization (DP)

Thought process: naive recursion repeats subproblems exponentially. Memoize to make linear.

```cpp
#include <bits/stdc++.h>
using namespace std;

long long fib_memo(int n, vector<long long>& memo){
    if(n<=1) return n;
    if(memo[n] != -1) return memo[n];
    memo[n] = fib_memo(n-1, memo) + fib_memo(n-2, memo);
    return memo[n];
}
int main(){
    int n = 50;
    vector<long long> memo(n+1, -1);
    cout << fib_memo(n, memo) << '\n';
}
```

Naive recursion cost: O(φ^n). With memo: O(n).

---

### Example E — 0/1 Knapsack (top-down + bottom-up)

Thought process: choose to take or skip an item → overlapping `(i, capacity)` subproblems → DP.

Top-down:

```cpp
#include <bits/stdc++.h>
using namespace std;
int n;
vector<int> wt, val;
vector<vector<int>> dp; // -1 uncomputed

int knap(int i, int W){
    if(i == n || W == 0) return 0;
    if(dp[i][W] != -1) return dp[i][W];
    int skip = knap(i+1, W);
    int take = (wt[i] <= W) ? val[i] + knap(i+1, W - wt[i]) : 0;
    return dp[i][W] = max(skip, take);
}

int main(){
    n = 3;
    wt = {3,4,6}; val = {2,3,1};
    int W = 7;
    dp.assign(n, vector<int>(W+1, -1));
    cout << knap(0, W) << '\n';
}
```

Bottom-up:

```cpp
int knap_bottom_up(){
    vector<int> dp(W+1, 0);
    for(int i=n-1;i>=0;--i){
        for(int w=W; w>=wt[i]; --w){
            dp[w] = max(dp[w], val[i] + dp[w-wt[i]]);
        }
    }
    return dp[W];
}
```

Complexity: O(n * W) time, O(W) space with optimization.

---

### Example F — Subset Sum (existence) — DP beats naive backtracking for large targets

Thought process: decide if some subset sums to `target`. Overlapping subproblems: `(i, sum)`.

Backtracking (exponential): try include/exclude — sometimes OK for small n.

DP (polynomial in target): `dp[s] = can we make sum s?` faster when target is moderate.

```cpp
#include <bits/stdc++.h>
using namespace std;
bool subsetSumDP(const vector<int>& a, int target){
    vector<char> dp(target+1, 0);
    dp[0] = 1;
    for(int x: a){
        for(int s = target; s >= x; --s)
            dp[s] = dp[s] | dp[s-x];
    }
    return dp[target];
}

int main(){
    vector<int> a = {3,34,4,12,5,2};
    cout << (subsetSumDP(a, 9) ? "YES\n": "NO\n");
}
```

Complexity: O(n * target). If `target` is small relative to number sizes, DP is best.

---

### Example G — Longest Increasing Subsequence (LIS) — DP approach

Thought process: standard DP with state `dp[i] = length LIS ending at i`. Overlapping subproblems ⇒ DP.

```cpp
#include <bits/stdc++.h>
using namespace std;
int LIS(vector<int>& a){
    int n = a.size();
    vector<int> dp(n, 1);
    int ans = 0;
    for(int i=0;i<n;++i){
        for(int j=0;j<i;++j)
            if(a[j] < a[i]) dp[i] = max(dp[i], dp[j] + 1);
        ans = max(ans, dp[i]);
    }
    return ans;
}
```

Complexity: O(n^2) for DP; can be optimized to O(n log n) with patience sorting (another technique).

---

### Example H — Bitmask DP: TSP (when n small)

Thought process: TSP is NP-hard. For n ≤ ~20, DP over subsets (bitmask) gives O(n^2 · 2^n) exact solution — much better than n! brute force.

Skeleton:

```cpp
// dp[mask][i] = min cost to visit subset mask and end at i
const int INF = 1e9;
int n; vector<vector<int>> cost; // cost[u][v]
vector<vector<int>> dp(1<<n, vector<int>(n, INF));
dp[1<<start][start] = 0;
for(mask from 0..(1<<n)-1)
  for(i from 0..n-1) if(dp[mask][i] < INF)
    for(j from 0..n-1) if(!(mask & (1<<j)))
      dp[mask | (1<<j)][j] = min(dp[mask | (1<<j)][j], dp[mask][i] + cost[i][j]);
```

Use when: n small but problem is combinatorial (Hamiltonian/TSP).

---

# 5) When backtracking + memoization turns into DP (and why that matters)

If your backtracking recursion visits the *same* state many times, memoize results. That converts exponential backtracking into DP. Example: naive recursion for Fibonacci is backtracking-like recursion but with repeated states; memoization yields linear DP.

**Important distinction:**

* Backtracking + memoization → you stop exploring branches that lead to already-known results. You may still need to enumerate distinct solutions in some problems — memoization might only help with counting/existence, not listing unique full solutions.

Example: counting ways to make change — recursive backtracking with memoization gives DP count.

---

# 6) Practical rules-of-thumb / cheat-sheet (use this in interviews)

* **Need all solutions / one valid arrangement / explicit sequences** → backtracking.
* **Need count / existence / best value / min cost** → DP (if overlapping subproblems).
* **If problem size or target is small (n ≤ 20)** → brute force or bitmask DP okay.
* **If weights/target ≤ 10^5 and n ≤ 100** → consider knapsack/subset DP.
* **If recursion repeats same state often** → use memoization (top-down DP).
* **If you can define `dp[i]` or `dp[i][j]` succinctly and transitions are local** → go DP.
* **If problem is NP-hard (TSP, Hamiltonian, graph coloring)** → exponential solutions unavoidable; use backtracking with pruning or exponential DP (bitmask) if possible.

---

# 7) Complexity comparisons (honest)

* Backtracking (no pruning): typically O(branching_factor^depth). For permutations: O(n!). For subsets: O(2^n).
* Backtracking with pruning: still exponential in worst case; pruning helps in practice.
* DP: polynomial in number of states × transition cost, e.g., knapsack O(nW). But if state includes a mask (`2^n` states), DP can be exponential but typically better than factorial.

---

# 8) A few pointed examples to remember (mnemonic)

* **Generate permutations / combinations / sudoku / word search / N-Queens** → backtracking.
* **Count ways / decide feasibility / compute max value with constraints (0/1 knapsack, LCS, edit distance, LIS (DP), coin change)** → DP.
* **If asked “is there a polynomial algorithm?” and it’s NP-hard → interviewer expects reasoning, maybe optimized exponential (branch&bound/bitmask DP), not classic DP.**

---

# 9) Final worked comparison — Subset Sum (both ways, small example)

**Case A (you must list subsets that sum to target) → Backtracking**

```cpp
void findSubsets(const vector<int>& a, int idx, int target, vector<int>& cur, vector<vector<int>>& out){
    if(target == 0){ out.push_back(cur); return; }
    if(idx == (int)a.size() || target < 0) return;
    // choose
    cur.push_back(a[idx]);
    findSubsets(a, idx+1, target - a[idx], cur, out);
    cur.pop_back();
    // don't choose
    findSubsets(a, idx+1, target, cur, out);
}
```

This enumerates actual subsets (exponential).

**Case B (you only need YES/NO if subset exists) → DP**

```cpp
bool subsetExists(const vector<int>& a, int target){
    vector<char> dp(target+1, 0);
    dp[0] = 1;
    for(int x: a)
        for(int s = target; s >= x; --s)
            dp[s] |= dp[s-x];
    return dp[target];
}
```

This is O(n * target), often much faster and uses little memory.

---

# 10) Closing — what I expect you to do now

* Next time you read a problem: run the 5-step checklist (output type, constraints, overlapping subproblems, NP-hardness, choose method). That eliminates confusion.
* If you want, I can:

  1. Give a set of 15 practice problems split by category (backtracking / DP / hybrid) with hints and full C++ solutions.
  2. Walk through one problem you struggled with and show step-by-step how to choose backtracking vs DP and write the final code.

Yes — and these are some of the most **interesting problems**, because they combine *search* (backtracking/DFS) with *optimization* (DP/memoization).
You can absolutely have both **backtracking + DP** in a single problem.

Let’s break this down.

---

# 1. Why both?

* **Backtracking is the framework**: you recursively explore possible choices.
* **DP is the optimizer**: you realize many recursive calls repeat the same state, so you cache/memoize results.

This combination happens in:

* Problems where you must **search choices step by step**, but **the subproblems overlap**.
* Often called **“Backtracking with memoization”** or **“Top-down DP”**.

---

# 2. Clear examples

## Example A — Word Break (LeetCode 139)

**Problem:** Given a string `s` and a dictionary of words, decide if `s` can be segmented into dictionary words.

* If you do pure backtracking:
  Try cutting the string at every index, recurse. That’s exponential.
* But many subproblems repeat (e.g., can `s[i..]` be segmented?).
  → Use DP/memoization.

**Hybrid solution:**

```cpp
#include <bits/stdc++.h>
using namespace std;

unordered_set<string> dict;
unordered_map<int,bool> memo;

bool dfs(const string& s, int start){
    if(start == s.size()) return true;
    if(memo.count(start)) return memo[start];

    for(int end=start+1; end<=s.size(); ++end){
        string word = s.substr(start, end-start);
        if(dict.count(word) && dfs(s, end))
            return memo[start] = true;
    }
    return memo[start] = false;
}

int main(){
    string s = "leetcode";
    dict = {"leet","code"};
    cout << dfs(s,0) << '\n'; // prints 1 (true)
}
```

👉 Backtracking explores cuts. DP memoizes `start` to avoid recomputation.

---

## Example B — Partition Equal Subset Sum (LeetCode 416)

**Problem:** Can array be partitioned into 2 subsets with equal sum?

* Pure backtracking: try including/excluding each number → 2^n.
* DP: realize it’s subset sum with state `(i, target)`.
* Code style looks like backtracking recursion but with DP memoization.

```cpp
#include <bits/stdc++.h>
using namespace std;

vector<int> nums;
unordered_map<long long,bool> memo;

bool dfs(int i, int target){
    if(target == 0) return true;
    if(i >= nums.size() || target < 0) return false;
    long long key = ((long long)i<<32) | target;
    if(memo.count(key)) return memo[key];

    return memo[key] = dfs(i+1, target-nums[i]) || dfs(i+1, target);
}

int main(){
    nums = {1,5,11,5};
    int sum = accumulate(nums.begin(), nums.end(), 0);
    if(sum%2) cout<<"NO\n";
    else cout << (dfs(0,sum/2) ? "YES\n" : "NO\n");
}
```

👉 Backtracking chooses take/skip. DP caches `(i,target)`.

---

## Example C — Unique Paths in a Grid with Obstacles

**Problem:** Find number of ways to reach bottom-right, moving only down/right, with some blocked cells.

* Backtracking: try moving down/right recursively.
* DP: memoize `(r, c)` to avoid recomputation.

```cpp
int dfs(int r, int c, vector<vector<int>>& grid, vector<vector<int>>& memo){
    int m = grid.size(), n = grid[0].size();
    if(r>=m || c>=n || grid[r][c]==1) return 0;
    if(r==m-1 && c==n-1) return 1;
    if(memo[r][c] != -1) return memo[r][c];
    return memo[r][c] = dfs(r+1,c,grid,memo) + dfs(r,c+1,grid,memo);
}
```

👉 It’s literally backtracking with DP memoization.

---

## Example D — Traveling Salesman Problem (TSP)

* Backtracking: try visiting next unvisited city (n! brute force).
* DP: store `(mask, lastCity)` → reduces to O(n²·2^n).
* Here, the framework is recursive search + memo table.

---

# 3. General pattern for **both**

* If you write a **recursive search (backtracking)** for a problem and you see **overlapping subproblems**, you can:

  * Keep recursion as is, but
  * Add a memo (DP table/hashmap).
    That converts exponential → polynomial (if state space is small).

So the rule of thumb:

* **Enumerate all?** → pure backtracking.
* **Just need count/yes/no/min/max?** → backtracking + memo = DP.

---

# 4. Where not both

* If you must **list ALL distinct solutions** (like permutations, Sudoku solutions) → memoization doesn’t help much, because you *can’t skip* states — you must generate them.
* If only existence/value is needed → you almost always add memoization, making it DP.

---

✅ So yes, many problems *start as backtracking* and become *DP* with memoization.
Think: **Backtracking is brute force search; DP is optimized search via caching.**

---
