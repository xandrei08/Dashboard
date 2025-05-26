import React, { useState, useCallback } from "react";
// Am eliminat SocialPlatform de aici dacă nu este folosit în '../../types' pentru celelalte tipuri
import {
  MonetizationEntry,
  TrackedPostItem,
  ViewState,
  ExpenseItem,
  RevenueIdea,
} from "../../types";
import { MonetizationEntryForm } from "./MonetizationEntryForm";
import { MonetizationSummary } from "./MonetizationSummary";
import { ExpenseForm } from "./ExpenseForm";
import Modal from "../common/Modal";
// Am eliminat InformationCircleIcon dacă nu este folosit
import {
  PlusCircleIcon,
  CurrencyDollarIcon,
  SparklesIcon,
  PencilIcon,
  TrashIcon,
  WalletIcon,
  LightbulbIcon,
} from "../common/Icons";
import {
  getMonetizationTips,
  isGeminiAvailable,
  suggestRevenueStreamsAI,
} from "../../services/geminiService";
import LoadingSpinner from "../common/LoadingSpinner";
import { DEFAULT_PLATFORMS } from "../../constants"; // Asigură-te că acest fișier exportă DEFAULT_PLATFORMS corect
import Tooltip from "../common/Tooltip";

interface MonetizationViewProps {
  monetizationEntries: MonetizationEntry[];
  setMonetizationEntries: React.Dispatch<
    React.SetStateAction<MonetizationEntry[]>
  >;
  expenses: ExpenseItem[];
  setExpenses: React.Dispatch<React.SetStateAction<ExpenseItem[]>>;
  trackedPosts: TrackedPostItem[];
  darkMode?: boolean;
}

// Presupunând că ViewState este definit în '../../types', de ex:
// export enum ViewState { LIST = 'LIST', ADD = 'ADD', /* etc. */ }

export const MonetizationView: React.FC<MonetizationViewProps> = ({
  monetizationEntries,
  setMonetizationEntries,
  expenses,
  setExpenses,
  trackedPosts,
  darkMode,
}) => {
  const [entryViewState, setEntryViewState] = useState<ViewState>(
    ViewState.LIST
  );
  const [expenseViewState, setExpenseViewState] = useState<ViewState>(
    ViewState.LIST
  );

  const [editingEntry, setEditingEntry] = useState<MonetizationEntry | null>(
    null
  );
  const [editingExpense, setEditingExpense] = useState<ExpenseItem | null>(
    null
  );

  const [showTipsModal, setShowTipsModal] = useState<boolean>(false);
  const [monetizationTips, setMonetizationTips] = useState<string[]>([]);
  const [tipsLoading, setTipsLoading] = useState<boolean>(false);
  const [tipsError, setTipsError] = useState<string | null>(null);
  const [selectedPlatformForTips, setSelectedPlatformForTips] =
    useState<string>(
      DEFAULT_PLATFORMS.length > 0 ? DEFAULT_PLATFORMS[0].id : ""
    );

  const [showRevenueIdeasModal, setShowRevenueIdeasModal] =
    useState<boolean>(false);
  const [revenueIdeas, setRevenueIdeas] = useState<RevenueIdea[]>([]);
  const [revenueIdeasLoading, setRevenueIdeasLoading] =
    useState<boolean>(false);
  const [revenueIdeasError, setRevenueIdeasError] = useState<string | null>(
    null
  );
  const [creatorNiche, setCreatorNiche] = useState<string>("");

  // Monetization Entry Handlers
  const handleAddEntry = useCallback(
    (entry: MonetizationEntry) => {
      setMonetizationEntries((prev) =>
        [
          ...prev,
          {
            ...entry,
            id:
              Date.now().toString() +
              Math.random().toString(36).substring(2, 9),
          },
        ].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )
      );
      setEntryViewState(ViewState.LIST);
    },
    [setMonetizationEntries]
  );

  const handleUpdateEntry = useCallback(
    (updatedEntry: MonetizationEntry) => {
      setMonetizationEntries((prev) =>
        prev
          .map((e) => (e.id === updatedEntry.id ? updatedEntry : e))
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )
      );
      setEntryViewState(ViewState.LIST);
      setEditingEntry(null);
    },
    [setMonetizationEntries]
  );

  const handleDeleteEntry = useCallback(
    (entryId: string) => {
      if (
        window.confirm("Are you sure you want to delete this earning entry?")
      ) {
        setMonetizationEntries((prev) => prev.filter((e) => e.id !== entryId));
      }
    },
    [setMonetizationEntries]
  );

  const handleEditEntry = useCallback((entry: MonetizationEntry) => {
    setEditingEntry(entry);
    setEntryViewState(ViewState.ADD);
  }, []); // setEditingEntry și setEntryViewState sunt stabile

  // Expense Handlers
  const handleAddExpense = useCallback(
    (expense: ExpenseItem) => {
      setExpenses((prev) =>
        [
          ...prev,
          {
            ...expense,
            id:
              Date.now().toString() +
              Math.random().toString(36).substring(2, 9),
          },
        ].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )
      );
      setExpenseViewState(ViewState.LIST);
    },
    [setExpenses]
  );

  const handleUpdateExpense = useCallback(
    (updatedExpense: ExpenseItem) => {
      setExpenses((prev) =>
        prev
          .map((e) => (e.id === updatedExpense.id ? updatedExpense : e))
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )
      );
      setExpenseViewState(ViewState.LIST);
      setEditingExpense(null);
    },
    [setExpenses]
  );

  const handleDeleteExpense = useCallback(
    (expenseId: string) => {
      if (
        window.confirm("Are you sure you want to delete this expense entry?")
      ) {
        setExpenses((prev) => prev.filter((e) => e.id !== expenseId));
      }
    },
    [setExpenses]
  );

  const handleEditExpense = useCallback((expense: ExpenseItem) => {
    setEditingExpense(expense);
    setExpenseViewState(ViewState.ADD);
  }, []); // setEditingExpense și setExpenseViewState sunt stabile

  const fetchMonetizationTipsInternal = async () => {
    if (!selectedPlatformForTips || !isGeminiAvailable()) return;
    setTipsLoading(true);
    setTipsError(null);
    setMonetizationTips([]);
    const platformName =
      DEFAULT_PLATFORMS.find((p) => p.id === selectedPlatformForTips)?.name ||
      "social media";
    try {
      const tips = await getMonetizationTips(platformName);
      if (tips) {
        setMonetizationTips(tips);
      } else {
        setTipsError("Failed to fetch monetization tips. No tips returned.");
      }
    } catch (error) {
      console.error("Error fetching monetization tips:", error);
      setTipsError(
        "An error occurred while fetching tips. Please ensure API key is set and try again."
      );
    } finally {
      setTipsLoading(false);
    }
  };

  const fetchRevenueIdeas = async () => {
    if (!creatorNiche.trim() || !isGeminiAvailable()) {
      setRevenueIdeasError("Please enter your content niche.");
      return;
    }
    setRevenueIdeasLoading(true);
    setRevenueIdeasError(null);
    setRevenueIdeas([]);
    const popularContentSummary = "general content in this niche";
    try {
      const ideas = await suggestRevenueStreamsAI(
        creatorNiche,
        popularContentSummary
      );
      if (ideas) {
        setRevenueIdeas(ideas);
      } else {
        setRevenueIdeasError(
          "Failed to fetch revenue ideas. No ideas returned."
        );
      }
    } catch (error) {
      console.error("Error fetching revenue ideas:", error);
      setRevenueIdeasError(
        "An error occurred while fetching revenue ideas. Ensure API key is set and try again."
      );
    } finally {
      setRevenueIdeasLoading(false);
    }
  };

  const cardBg = darkMode
    ? "bg-slate-800 border-slate-700"
    : "bg-white border-gray-200";
  const textColor = darkMode ? "text-slate-300" : "text-gray-600";
  const titleColor = darkMode ? "text-slate-100" : "text-gray-800";
  const buttonBaseStyle =
    "text-white font-semibold py-2 px-3 rounded-lg shadow-md transition duration-150 ease-in-out text-sm flex items-center";

  return (
    <div
      className={`${
        darkMode ? "bg-slate-900 text-slate-100" : "bg-gray-50 text-gray-800"
      } p-4 rounded-lg shadow-lg`}
    >
      <div className="flex flex-wrap justify-between items-center mb-6 gap-2">
        <h2 className="text-2xl font-semibold flex items-center">
          <CurrencyDollarIcon
            className={`w-7 h-7 mr-2 ${
              darkMode ? "text-accent-400" : "text-primary-600"
            }`}
          />
          Monetization Hub
        </h2>
        <div className="flex flex-wrap gap-2">
          {isGeminiAvailable() && (
            <Tooltip
              text="Get AI-powered tips for monetizing your content on specific platforms."
              darkMode={darkMode}
            >
              <button
                onClick={() => setShowTipsModal(true)}
                className={`${buttonBaseStyle} ${
                  darkMode
                    ? "bg-teal-500 hover:bg-teal-600"
                    : "bg-teal-500 hover:bg-teal-600"
                }`}
              >
                <SparklesIcon className="w-4 h-4 mr-1.5" />
                Monetization Tips
              </button>
            </Tooltip>
          )}
          {isGeminiAvailable() && (
            <Tooltip
              text="Get AI-generated ideas for new revenue streams based on your niche."
              darkMode={darkMode}
            >
              <button
                onClick={() => setShowRevenueIdeasModal(true)}
                className={`${buttonBaseStyle} ${
                  darkMode
                    ? "bg-purple-500 hover:bg-purple-600"
                    : "bg-purple-500 hover:bg-purple-600"
                }`}
              >
                <LightbulbIcon className="w-4 h-4 mr-1.5" />
                Revenue Ideas (AI)
              </button>
            </Tooltip>
          )}
          <Tooltip text="Add a new earning entry." darkMode={darkMode}>
            <button
              onClick={() => {
                setEditingEntry(null);
                setEntryViewState(ViewState.ADD);
              }}
              className={`${buttonBaseStyle} ${
                darkMode
                  ? "bg-accent-500 hover:bg-accent-600"
                  : "bg-primary-500 hover:bg-primary-600"
              }`}
            >
              <PlusCircleIcon className="w-4 h-4 mr-1.5" />
              Add Earning
            </button>
          </Tooltip>
          <Tooltip text="Add a new expense entry." darkMode={darkMode}>
            <button
              onClick={() => {
                setEditingExpense(null);
                setExpenseViewState(ViewState.ADD);
              }}
              className={`${buttonBaseStyle} ${
                darkMode
                  ? "bg-orange-500 hover:bg-orange-600"
                  : "bg-orange-500 hover:bg-orange-600"
              }`}
            >
              <WalletIcon className="w-4 h-4 mr-1.5" />
              Add Expense
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Modals */}
      <Modal
        isOpen={entryViewState === ViewState.ADD}
        onClose={() => {
          setEntryViewState(ViewState.LIST);
          setEditingEntry(null);
        }}
        title={editingEntry ? "Edit Earning Entry" : "Add New Earning Entry"}
        darkMode={darkMode}
      >
        <MonetizationEntryForm
          onSave={editingEntry ? handleUpdateEntry : handleAddEntry}
          onCancel={() => {
            setEntryViewState(ViewState.LIST);
            setEditingEntry(null);
          }}
          initialEntry={editingEntry}
          trackedPosts={trackedPosts}
          platforms={DEFAULT_PLATFORMS}
          darkMode={darkMode}
        />
      </Modal>

      <Modal
        isOpen={expenseViewState === ViewState.ADD}
        onClose={() => {
          setExpenseViewState(ViewState.LIST);
          setEditingExpense(null);
        }}
        title={editingExpense ? "Edit Expense Entry" : "Add New Expense Entry"}
        darkMode={darkMode}
      >
        <ExpenseForm
          onSave={editingExpense ? handleUpdateExpense : handleAddExpense}
          onCancel={() => {
            setExpenseViewState(ViewState.LIST);
            setEditingExpense(null);
          }}
          initialExpense={editingExpense}
          darkMode={darkMode}
        />
      </Modal>

      <Modal
        isOpen={showTipsModal}
        onClose={() => setShowTipsModal(false)}
        title="AI Monetization Tips"
        darkMode={darkMode}
      >
        <div className="space-y-3">
          <div>
            <label
              htmlFor="platformForTips"
              className={`block text-sm font-medium ${
                darkMode ? "text-slate-300" : "text-gray-700"
              } mb-1`}
            >
              Select Platform:
            </label>
            <select
              id="platformForTips"
              value={selectedPlatformForTips}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setSelectedPlatformForTips(e.target.value)
              }
              className={`${
                darkMode
                  ? "bg-slate-700 border-slate-600 text-slate-100 focus:ring-accent-500 focus:border-accent-500"
                  : "bg-white border-gray-300 text-gray-900 focus:ring-primary-500 focus:border-primary-500"
              } block w-full sm:text-sm border rounded-md p-2 shadow-sm`}
            >
              {DEFAULT_PLATFORMS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
              <option value="general">General Social Media</option>{" "}
              {/* Consider adding a constant for "general" if used elsewhere */}
            </select>
          </div>
          <button
            onClick={fetchMonetizationTipsInternal}
            disabled={tipsLoading || !selectedPlatformForTips}
            className={`w-full flex items-center justify-center ${
              darkMode
                ? "bg-accent-500 hover:bg-accent-600 disabled:bg-slate-600"
                : "bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300"
            } text-white font-semibold py-2 px-3 rounded-md shadow-sm transition`}
          >
            {tipsLoading ? (
              <LoadingSpinner size="sm" darkMode={!darkMode} />
            ) : (
              <>
                <SparklesIcon className="w-4 h-4 mr-2" /> Get Tips
              </>
            )}
          </button>
          {tipsError && <p className="text-sm text-red-500">{tipsError}</p>}
          {monetizationTips.length > 0 && (
            <ul
              className={`list-disc list-inside space-y-1 pl-2 text-sm ${
                darkMode ? "text-slate-200" : "text-gray-700"
              }`}
            >
              {monetizationTips.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          )}
          {!isGeminiAvailable() && (
            <p
              className={`text-sm ${
                darkMode ? "text-yellow-400" : "text-yellow-600"
              }`}
            >
              AI features are disabled. Please set API_KEY.
            </p>
          )}
        </div>
      </Modal>

      <Modal
        isOpen={showRevenueIdeasModal}
        onClose={() => setShowRevenueIdeasModal(false)}
        title="AI Revenue Stream Ideas"
        darkMode={darkMode}
      >
        <div className="space-y-3">
          <div>
            <label
              htmlFor="creatorNiche"
              className={`block text-sm font-medium ${
                darkMode ? "text-slate-300" : "text-gray-700"
              } mb-1`}
            >
              Your Content Niche:
            </label>
            <input
              type="text"
              id="creatorNiche"
              value={creatorNiche}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setCreatorNiche(e.target.value)
              }
              placeholder="e.g., Gaming, Cooking, Tech Reviews"
              className={`${
                darkMode
                  ? "bg-slate-700 border-slate-600 text-slate-100 focus:ring-accent-500 focus:border-accent-500"
                  : "bg-white border-gray-300 text-gray-900 focus:ring-primary-500 focus:border-primary-500"
              } block w-full sm:text-sm border rounded-md p-2 shadow-sm`}
            />
          </div>
          <button
            onClick={fetchRevenueIdeas}
            disabled={revenueIdeasLoading || !creatorNiche.trim()}
            className={`w-full flex items-center justify-center ${
              darkMode
                ? "bg-purple-500 hover:bg-purple-600 disabled:bg-slate-600"
                : "bg-purple-500 hover:bg-purple-600 disabled:bg-gray-300"
            } text-white font-semibold py-2 px-3 rounded-md shadow-sm transition`}
          >
            {revenueIdeasLoading ? (
              <LoadingSpinner size="sm" darkMode={!darkMode} />
            ) : (
              <>
                <LightbulbIcon className="w-4 h-4 mr-2" /> Get Ideas
              </>
            )}
          </button>
          {revenueIdeasError && (
            <p className="text-sm text-red-500">{revenueIdeasError}</p>
          )}
          {revenueIdeas.length > 0 && (
            <div className="space-y-2">
              {revenueIdeas.map(
                (
                  idea,
                  index // Ideal ar fi ca RevenueIdea să aibă un ID unic pentru 'key'
                ) => (
                  <div
                    key={idea.idea || index}
                    className={`p-2 rounded ${
                      darkMode ? "bg-slate-700" : "bg-gray-100"
                    }`}
                  >
                    <h4
                      className={`font-semibold text-sm ${
                        darkMode ? "text-purple-300" : "text-purple-700"
                      }`}
                    >
                      {idea.idea}{" "}
                      <span
                        className={`text-xs font-normal px-1.5 py-0.5 rounded-full ${
                          darkMode ? "bg-slate-600" : "bg-gray-200"
                        }`}
                      >
                        Potential: {idea.potential}
                      </span>
                    </h4>
                    <p
                      className={`text-xs ${
                        darkMode ? "text-slate-300" : "text-gray-600"
                      }`}
                    >
                      {idea.description}
                    </p>
                  </div>
                )
              )}
            </div>
          )}
          {!isGeminiAvailable() && (
            <p
              className={`text-sm ${
                darkMode ? "text-yellow-400" : "text-yellow-600"
              }`}
            >
              AI features are disabled. Please set API_KEY.
            </p>
          )}
        </div>
      </Modal>

      {/* Main Content Area */}
      <MonetizationSummary
        entries={monetizationEntries}
        expenses={expenses}
        darkMode={darkMode}
      />

      <div className="grid md:grid-cols-2 gap-6 mt-6">
        {/* Earnings Section */}
        <div>
          <h3 className={`text-xl font-semibold mb-3 ${titleColor}`}>
            Earnings
          </h3>
          {monetizationEntries.length === 0 &&
          entryViewState === ViewState.LIST ? (
            <div
              className={`text-center py-8 ${
                darkMode ? "text-slate-400" : "text-gray-500"
              }`}
            >
              <CurrencyDollarIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No earnings recorded yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {monetizationEntries.map((entry) => (
                <div
                  key={entry.id}
                  className={`p-3 rounded-md shadow border ${cardBg} flex justify-between items-center`}
                >
                  <div>
                    <p className={`font-medium ${titleColor}`}>
                      {entry.source}
                    </p>
                    <p className={`${textColor} text-sm`}>
                      Amount:{" "}
                      <span className="font-semibold text-green-500">
                        ${entry.amount.toFixed(2)}
                      </span>
                    </p>
                    <p className={`${textColor} text-xs`}>
                      Date: {new Date(entry.date).toLocaleDateString()}
                    </p>
                    {entry.platformId && (
                      <p className={`${textColor} text-xs`}>
                        Platform:{" "}
                        {DEFAULT_PLATFORMS.find(
                          (p) => p.id === entry.platformId
                        )?.name || entry.platformId}
                      </p>
                    )}
                    {entry.notes && (
                      <p className={`${textColor} text-xs italic`}>
                        Notes: {entry.notes}
                      </p>
                    )}
                  </div>
                  <div className="flex space-x-1.5">
                    <Tooltip text="Edit Earning" darkMode={darkMode}>
                      <button
                        onClick={() => handleEditEntry(entry)}
                        className={`p-1.5 rounded ${
                          darkMode ? "hover:bg-slate-700" : "hover:bg-gray-100"
                        } text-blue-500`}
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                    </Tooltip>
                    <Tooltip text="Delete Earning" darkMode={darkMode}>
                      <button
                        onClick={() => handleDeleteEntry(entry.id)}
                        className={`p-1.5 rounded ${
                          darkMode ? "hover:bg-slate-700" : "hover:bg-gray-100"
                        } text-red-500`}
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </Tooltip>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Expenses Section */}
        <div>
          <h3 className={`text-xl font-semibold mb-3 ${titleColor}`}>
            Expenses
          </h3>
          {expenses.length === 0 && expenseViewState === ViewState.LIST ? (
            <div
              className={`text-center py-8 ${
                darkMode ? "text-slate-400" : "text-gray-500"
              }`}
            >
              <WalletIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No expenses recorded yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {expenses.map((expense) => (
                <div
                  key={expense.id}
                  className={`p-3 rounded-md shadow border ${cardBg} flex justify-between items-center`}
                >
                  <div>
                    <p className={`font-medium ${titleColor}`}>
                      {expense.description}
                    </p>
                    <p className={`${textColor} text-sm`}>
                      Amount:{" "}
                      <span className="font-semibold text-red-500">
                        -${expense.amount.toFixed(2)}
                      </span>
                    </p>
                    <p className={`${textColor} text-xs`}>
                      Date: {new Date(expense.date).toLocaleDateString()}
                    </p>
                    {expense.category && (
                      <p className={`${textColor} text-xs`}>
                        Category: {expense.category}
                      </p>
                    )}
                  </div>
                  <div className="flex space-x-1.5">
                    <Tooltip text="Edit Expense" darkMode={darkMode}>
                      <button
                        onClick={() => handleEditExpense(expense)}
                        className={`p-1.5 rounded ${
                          darkMode ? "hover:bg-slate-700" : "hover:bg-gray-100"
                        } text-blue-500`}
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                    </Tooltip>
                    <Tooltip text="Delete Expense" darkMode={darkMode}>
                      <button
                        onClick={() => handleDeleteExpense(expense.id)}
                        className={`p-1.5 rounded ${
                          darkMode ? "hover:bg-slate-700" : "hover:bg-gray-100"
                        } text-red-500`}
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </Tooltip>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
