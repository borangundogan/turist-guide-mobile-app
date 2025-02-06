#import "AppDelegate.h"
#import <GoogleMaps/GoogleMaps.h>

#import <React/RCTBundleURLProvider.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  NSString *googleMapsApiKey = [[NSProcessInfo processInfo] environmentVariables][@"GOOGLE_MAPS_API_KEY"];
  if (googleMapsApiKey) {
    [GMSServices provideAPIKey:googleMapsApiKey];
  } else {
    NSLog(@"Warning: GOOGLE_MAPS_API_KEY environment variable is not set");
  }
  
  self.moduleName = @"TravelRouteApp";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};

  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self bundleURL];
}

- (NSURL *)bundleURL
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end
