import { NavigationMenu, NavigationMenuLink } from "@radix-ui/react-navigation-menu";
import { CircleUser, Info, Settings } from "lucide-react";
import { PropsWithChildren } from "react";
import { useMatches } from "react-router-dom";

export const PageLayout: React.FC<PropsWithChildren> = ({ children }) => {

    const matches = useMatches()

    return (
      <div className="flex flex-col min-h-screen p-8">
        <div className="flex items-end flex-row gap-16">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold">EMA</h1>
            <p className="text-sm text-gray-400">Enhanced Medical Aggregator</p>
          </div>

            <NavigationMenu className="flex gap-8">
              <NavigationMenuLink className={`text-lg font-semibold ${matches[0]?.pathname === '/' ? 'text-cyan-600' : undefined}`} href="/">Přehled</NavigationMenuLink>
              <NavigationMenuLink className={`text-lg font-semibold ${matches[0]?.pathname === '/schemes' ? 'text-cyan-600' : undefined}`} href="/schemes">Šablony</NavigationMenuLink>
            </NavigationMenu>

            <div className="flex-grow flex-shrink" />

            <div className="flex items-start h-full mb-4 gap-8">
              <Info style={{ cursor: 'pointer' }} />
              <Settings style={{ cursor: 'pointer' }} />
              <CircleUser style={{ cursor: 'pointer' }} />
            </div>
        </div>
  
        
        <div className="h-8" />

        <div style={{ maxWidth: "1200px" }} className="mx-auto w-full">
          {children}
        </div>
      </div>
    )
}