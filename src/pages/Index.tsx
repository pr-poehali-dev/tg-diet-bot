import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface MealItem {
  id: number;
  name: string;
  time: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  image?: string;
}

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [dailyCalories] = useState(1450);
  const [targetCalories] = useState(2000);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const meals: MealItem[] = [
    {
      id: 1,
      name: 'Овсянка с ягодами',
      time: '08:30',
      calories: 320,
      protein: 12,
      carbs: 54,
      fats: 8,
    },
    {
      id: 2,
      name: 'Куриная грудка с рисом',
      time: '13:00',
      calories: 550,
      protein: 45,
      carbs: 60,
      fats: 12,
    },
    {
      id: 3,
      name: 'Греческий салат',
      time: '16:30',
      calories: 280,
      protein: 8,
      carbs: 15,
      fats: 22,
    },
    {
      id: 4,
      name: 'Лосось с овощами',
      time: '19:00',
      calories: 300,
      protein: 25,
      carbs: 10,
      fats: 18,
    },
  ];

  const weekStats = [
    { day: 'Пн', calories: 1850 },
    { day: 'Вт', calories: 2100 },
    { day: 'Ср', calories: 1920 },
    { day: 'Чт', calories: 1750 },
    { day: 'Пт', calories: 2050 },
    { day: 'Сб', calories: 1680 },
    { day: 'Вс', calories: 1450 },
  ];

  const maxCalories = Math.max(...weekStats.map((s) => s.calories));

  const totalProtein = meals.reduce((sum, meal) => sum + meal.protein, 0);
  const totalCarbs = meals.reduce((sum, meal) => sum + meal.carbs, 0);
  const totalFats = meals.reduce((sum, meal) => sum + meal.fats, 0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedFile(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const CalorieCircle = ({ current, target }: { current: number; target: number }) => {
    const percentage = (current / target) * 100;
    const circumference = 2 * Math.PI * 70;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative w-48 h-48 mx-auto">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="96"
            cy="96"
            r="70"
            stroke="hsl(var(--muted))"
            strokeWidth="12"
            fill="none"
          />
          <circle
            cx="96"
            cy="96"
            r="70"
            stroke="url(#gradient)"
            strokeWidth="12"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#D946EF" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-4xl font-bold text-white">{current}</p>
          <p className="text-sm text-muted-foreground">из {target}</p>
          <p className="text-xs text-muted-foreground mt-1">ккал</p>
        </div>
      </div>
    );
  };

  const MacroCircle = ({ value, max, label, color }: { value: number; max: number; label: string; color: string }) => {
    const percentage = (value / max) * 100;

    return (
      <div className="flex flex-col items-center">
        <div className="relative w-20 h-20">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="40"
              cy="40"
              r="32"
              stroke="hsl(var(--muted))"
              strokeWidth="6"
              fill="none"
            />
            <circle
              cx="40"
              cy="40"
              r="32"
              stroke={color}
              strokeWidth="6"
              fill="none"
              strokeDasharray={2 * Math.PI * 32}
              strokeDashoffset={2 * Math.PI * 32 * (1 - percentage / 100)}
              strokeLinecap="round"
              className="transition-all duration-700"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-lg font-bold text-white">{value}г</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2">{label}</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 pb-20">
      <div className="max-w-md mx-auto">
        {activeTab === 'home' && (
          <div className="p-6 space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white">Привет! 👋</h1>
                <p className="text-sm text-muted-foreground">Сегодня {new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}</p>
              </div>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Icon name="Bell" size={20} />
              </Button>
            </div>

            <Card className="bg-gradient-to-br from-primary via-secondary to-accent p-8 border-0 shadow-2xl">
              <CalorieCircle current={dailyCalories} target={targetCalories} />
              <div className="flex justify-around mt-6">
                <MacroCircle value={totalProtein} max={150} label="Белки" color="#8B5CF6" />
                <MacroCircle value={totalCarbs} max={250} label="Углеводы" color="#D946EF" />
                <MacroCircle value={totalFats} max={70} label="Жиры" color="#F97316" />
              </div>
            </Card>

            <div>
              <h2 className="text-lg font-semibold text-white mb-3">Приемы пищи</h2>
              <div className="space-y-3">
                {meals.map((meal, index) => (
                  <Card
                    key={meal.id}
                    className="p-4 bg-card/80 backdrop-blur-sm border-border/50 hover:bg-card/90 transition-all cursor-pointer animate-slide-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-white">{meal.name}</h3>
                          <Badge variant="secondary" className="text-xs">{meal.time}</Badge>
                        </div>
                        <p className="text-2xl font-bold text-primary mt-1">{meal.calories} ккал</p>
                        <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
                          <span>Б: {meal.protein}г</span>
                          <span>У: {meal.carbs}г</span>
                          <span>Ж: {meal.fats}г</span>
                        </div>
                      </div>
                      <Icon name="ChevronRight" size={20} className="text-muted-foreground" />
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'scan' && (
          <div className="p-6 space-y-6 animate-fade-in">
            <h1 className="text-2xl font-bold text-white">Сканирование</h1>
            
            <Card className="p-8 bg-card/80 backdrop-blur-sm border-border/50 text-center">
              {!selectedFile ? (
                <div className="space-y-4">
                  <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <Icon name="Camera" size={48} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Загрузите фото еды</h3>
                    <p className="text-sm text-muted-foreground">AI определит блюдо и подсчитает калории</p>
                  </div>
                  <label htmlFor="file-upload">
                    <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 cursor-pointer" asChild>
                      <span>
                        <Icon name="Upload" size={20} className="mr-2" />
                        Выбрать фото
                      </span>
                    </Button>
                  </label>
                  <Input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>
              ) : (
                <div className="space-y-4 animate-scale-in">
                  <img src={selectedFile} alt="Food" className="w-full h-64 object-cover rounded-xl" />
                  <div className="space-y-3">
                    <div className="flex items-center justify-center gap-2">
                      <Icon name="Sparkles" size={20} className="text-primary animate-pulse" />
                      <p className="text-sm text-muted-foreground">Анализирую блюдо...</p>
                    </div>
                    <Card className="p-4 bg-gradient-to-r from-primary/20 to-secondary/20 border-primary/30">
                      <h3 className="text-lg font-bold text-white mb-3">Результат анализа</h3>
                      <div className="space-y-2 text-left">
                        <p className="text-white"><span className="text-muted-foreground">Блюдо:</span> Паста Карбонара</p>
                        <p className="text-2xl font-bold text-primary">520 ккал</p>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Белки: 22г</span>
                          <span className="text-muted-foreground">Углеводы: 58г</span>
                          <span className="text-muted-foreground">Жиры: 18г</span>
                        </div>
                      </div>
                    </Card>
                    <div className="flex gap-2">
                      <Button className="flex-1 bg-gradient-to-r from-primary to-secondary">
                        <Icon name="Plus" size={20} className="mr-2" />
                        Добавить
                      </Button>
                      <Button variant="outline" onClick={() => setSelectedFile(null)}>
                        <Icon name="X" size={20} />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </Card>

            <Card className="p-4 bg-accent/10 border-accent/30">
              <div className="flex gap-3">
                <Icon name="Lightbulb" size={24} className="text-accent flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-white mb-1">Совет</h4>
                  <p className="text-sm text-muted-foreground">Для точного результата фотографируйте еду на белом фоне</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="p-6 space-y-6 animate-fade-in">
            <h1 className="text-2xl font-bold text-white">Статистика</h1>

            <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50">
              <h3 className="text-lg font-semibold text-white mb-4">Калории за неделю</h3>
              <div className="flex items-end justify-between gap-2 h-48">
                {weekStats.map((stat, index) => (
                  <div key={stat.day} className="flex-1 flex flex-col items-center gap-2">
                    <div
                      className="w-full bg-gradient-to-t from-primary to-secondary rounded-t-lg transition-all duration-700 hover:opacity-80"
                      style={{
                        height: `${(stat.calories / maxCalories) * 100}%`,
                        animationDelay: `${index * 0.1}s`,
                      }}
                    />
                    <span className="text-xs text-muted-foreground">{stat.day}</span>
                    <span className="text-xs font-semibold text-white">{stat.calories}</span>
                  </div>
                ))}
              </div>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4 bg-gradient-to-br from-primary/20 to-primary/10 border-primary/30">
                <Icon name="TrendingUp" size={24} className="text-primary mb-2" />
                <p className="text-2xl font-bold text-white">1890</p>
                <p className="text-sm text-muted-foreground">Средние ккал/день</p>
              </Card>
              <Card className="p-4 bg-gradient-to-br from-secondary/20 to-secondary/10 border-secondary/30">
                <Icon name="Target" size={24} className="text-secondary mb-2" />
                <p className="text-2xl font-bold text-white">5/7</p>
                <p className="text-sm text-muted-foreground">Дней в цели</p>
              </Card>
              <Card className="p-4 bg-gradient-to-br from-accent/20 to-accent/10 border-accent/30">
                <Icon name="Flame" size={24} className="text-accent mb-2" />
                <p className="text-2xl font-bold text-white">12</p>
                <p className="text-sm text-muted-foreground">Серия дней</p>
              </Card>
              <Card className="p-4 bg-gradient-to-br from-primary/20 to-secondary/20 border-primary/30">
                <Icon name="Award" size={24} className="text-primary mb-2" />
                <p className="text-2xl font-bold text-white">2.1кг</p>
                <p className="text-sm text-muted-foreground">Прогресс</p>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="p-6 space-y-6 animate-fade-in">
            <h1 className="text-2xl font-bold text-white">Профиль</h1>

            <Card className="p-6 bg-gradient-to-br from-primary via-secondary to-accent border-0">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-4xl">
                  👤
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Александр</h2>
                  <p className="text-sm text-white/80">25 лет • 75 кг • 180 см</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50">
              <h3 className="font-semibold text-white mb-4">Цели</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Целевой вес</span>
                    <span className="text-white font-semibold">70 кг</span>
                  </div>
                  <Progress value={60} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Калории в день</span>
                    <span className="text-white font-semibold">2000 ккал</span>
                  </div>
                  <Progress value={73} className="h-2" />
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50">
              <h3 className="font-semibold text-white mb-4">Рекомендации</h3>
              <div className="space-y-3">
                <div className="flex gap-3 items-start">
                  <Icon name="Apple" size={20} className="text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-white">Добавьте больше белка</p>
                    <p className="text-xs text-muted-foreground">Старайтесь есть 120-150г белка в день</p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <Icon name="Droplet" size={20} className="text-secondary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-white">Пейте больше воды</p>
                    <p className="text-xs text-muted-foreground">Рекомендуется 2-2.5 литра в день</p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <Icon name="Moon" size={20} className="text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-white">Избегайте еды перед сном</p>
                    <p className="text-xs text-muted-foreground">Последний прием пищи за 3 часа до сна</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-md border-t border-border">
          <div className="max-w-md mx-auto px-6 py-3">
            <div className="flex justify-around">
              <Button
                variant="ghost"
                className={`flex flex-col items-center gap-1 h-auto py-2 ${activeTab === 'home' ? 'text-primary' : 'text-muted-foreground'}`}
                onClick={() => setActiveTab('home')}
              >
                <Icon name="Home" size={24} />
                <span className="text-xs">Главная</span>
              </Button>
              <Button
                variant="ghost"
                className={`flex flex-col items-center gap-1 h-auto py-2 ${activeTab === 'scan' ? 'text-primary' : 'text-muted-foreground'}`}
                onClick={() => setActiveTab('scan')}
              >
                <div className="w-14 h-14 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center -mt-8 shadow-xl">
                  <Icon name="Camera" size={28} className="text-white" />
                </div>
              </Button>
              <Button
                variant="ghost"
                className={`flex flex-col items-center gap-1 h-auto py-2 ${activeTab === 'stats' ? 'text-primary' : 'text-muted-foreground'}`}
                onClick={() => setActiveTab('stats')}
              >
                <Icon name="BarChart3" size={24} />
                <span className="text-xs">Статистика</span>
              </Button>
              <Button
                variant="ghost"
                className={`flex flex-col items-center gap-1 h-auto py-2 ${activeTab === 'profile' ? 'text-primary' : 'text-muted-foreground'}`}
                onClick={() => setActiveTab('profile')}
              >
                <Icon name="User" size={24} />
                <span className="text-xs">Профиль</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
