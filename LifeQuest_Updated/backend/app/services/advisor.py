from datetime import datetime, date

def build_advice(character, streak, quests):
    active = [q for q in quests if q.status == 'active']
    completed = [q for q in quests if q.status == 'completed']
    by_category = {}
    for q in quests:
        by_category[q.category] = by_category.get(q.category, 0) + 1
    recommendations = []
    if len(active) == 0:
        recommendations.append({"priority":"high","title":"Start with one clear quest","message":"Create one small, finishable quest to begin your momentum today."})
    elif len(active) > 5:
        recommendations.append({"priority":"high","title":"Reduce quest overload","message":"You have many active quests. Finish or remove lower-priority tasks before adding more."})
    else:
        recommendations.append({"priority":"medium","title":"Protect your streak","message":"Complete your smallest active quest first to keep momentum without burning out."})
    weak = min({
        'strength': character.strength,
        'intelligence': character.intelligence,
        'technology': character.technology,
        'focus': character.focus,
        'creativity': character.creativity,
        'discipline': character.discipline,
    }, key=lambda k: getattr(character, k))
    recommendations.append({"priority":"medium","title":f"Train your {weak.title()} attribute","message":f"Choose a quest category that strengthens {weak}. LifeQuest rewards focused, balanced progression."})
    if len(completed) >= 5:
        recommendations.append({"priority":"low","title":"Create an Epic Boss","message":"Turn a large goal into a boss with smaller tasks so every completed task deals visible damage."})
    return recommendations
