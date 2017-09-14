/*******************************************************************************
 * Copyright (c) 2017 IBM Corp.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *******************************************************************************/
package application.ibmcloud;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.stereotype.Component;


/**
 * Bean that allows access to values set in the generated mappings.json file.
 * Once injected into a class it can be used directly to resolve values via
 * the mapBean method or indirectly with the use of property injections using
 * the @Value annotation.
 *
 */
@Component
public class ServiceMappings {

	@Autowired
    private ConfigurableEnvironment env;
	
	private Mappings mappings;
	
	@PostConstruct
    public void init() {
		//registers the mapping bean as a property source so that it works with @Value
		mappings = new Mappings("CloudServices");
        env.getPropertySources().addFirst(mappings);
    }
	
	public String getValue(String name) {
		return (String) mappings.getProperty(name);
	}

}
